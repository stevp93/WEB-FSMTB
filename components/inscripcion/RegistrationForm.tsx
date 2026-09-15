'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { m } from 'framer-motion';
import { ChevronDown, CircleCheckBig, LoaderCircle, MessageCircle, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { reserveSpot, type ReserveResult } from '@/lib/leads-client';
import { useToast } from '@/components/providers/Toast';
import { buttonClass, inlineLinkClass } from '@/components/ui/button';
import { cx } from '@/components/ui/cx';
import { EASE_OUT } from '@/components/ui/motion';
import { EVENT, ROUTES, ROUTE_ORDER, formatCOP, formatThousands, type RouteId } from '@/lib/event';
import { JERSEY_SIZES, registrationSchema, type Registration, type RegistrationInput } from '@/lib/registration';
import { GENERAL_MESSAGE, registrationMessage, whatsappLink } from '@/lib/whatsapp';

type Success = Extract<ReserveResult, { ok: true }> & { whatsappUrl: string; popupOpened: boolean };

type ControlAttrs = { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string };

const inputClass = (invalid: boolean) =>
  cx(
    'block min-h-12 w-full rounded-sm border bg-canvas px-4 text-base text-ink transition-colors duration-150',
    invalid ? 'border-alert ring-1 ring-alert' : 'border-line/40 hover:border-line/70',
  );

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm font-medium text-alert">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

function Field({
  name,
  label,
  helper,
  error,
  className,
  children,
}: {
  name: string;
  label: string;
  helper?: string;
  error?: string;
  className?: string;
  children: (attrs: ControlAttrs) => ReactNode;
}) {
  const id = `f-${name}`;
  const helpId = helper ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-semibold text-ink">
        {label}
      </label>
      {helper ? (
        <p id={helpId} className="mt-1 text-sm text-ink-muted">
          {helper}
        </p>
      ) : null}
      <div className="relative mt-2">{children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}</div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function SuccessPanel({ success }: { success: Success }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const route = ROUTES[success.category];
  const firstName = success.fullName.split(/\s+/)[0];

  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <div>
      <CircleCheckBig className="size-10 text-accent" aria-hidden />
      <h2 ref={heading} tabIndex={-1} className="mt-5 font-display text-2xl font-semibold text-ink focus:outline-none">
        Cupo reservado
      </h2>
      <p className="mt-4 max-w-measure-sm text-lg text-ink-muted">
        {firstName}, tu cupo en la <strong className="font-semibold text-ink">{route.name}</strong> quedó registrado con la
        referencia <strong className="tabular font-semibold text-ink">{success.reference}</strong>.
      </p>
      <p className="mt-3 max-w-measure-sm text-ink-muted">
        Para completar tu inscripción, confirma el pago de {formatCOP(EVENT.price)} por WhatsApp.
        {success.popupOpened ? ' Ya abrimos la conversación en otra pestaña.' : ''}
      </p>
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <a href={success.whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('primary', 'lg')}>
          <MessageCircle className="size-5" aria-hidden />
          Continuar en WhatsApp
        </a>
        <Link href="/kit-servicios" className={buttonClass('secondary', 'lg')}>
          Ver qué incluye tu kit
        </Link>
      </div>
    </div>
  );
}

export function RegistrationForm() {
  const toast = useToast();
  const [success, setSuccess] = useState<Success | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<RegistrationInput, unknown, Registration>({
    resolver: zodResolver(registrationSchema),
    mode: 'onTouched',
    shouldFocusError: false,
  });

  // Página estática: la categoría llega por ?categoria= desde las tarjetas de Recorridos.
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get('categoria');
    if (category === 'carrera' || category === 'travesia') setValue('category', category satisfies RouteId);
  }, [setValue]);

  // Tras cada envío (ya pintado): foco al primer campo inválido en orden visual, o al aviso del servidor.
  useEffect(() => {
    if (!submitCount) return;
    const field = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (field) field.focus();
    else if (serverError) errorBox.current?.focus();
  }, [submitCount, serverError]);

  const onValid = async (data: Registration) => {
    setServerError(null);
    let result: ReserveResult;
    try {
      result = await reserveSpot(data);
    } catch {
      result = {
        ok: false,
        reason: 'storage',
        message: 'No hubo conexión con el servidor. Revisa tu internet y vuelve a intentarlo: tus datos siguen en el formulario.',
      };
    }

    if (!result.ok) {
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        if (messages?.[0]) setError(field as keyof RegistrationInput, { type: 'server', message: messages[0] });
      }
      setServerError(result.message);
      return;
    }

    const whatsappUrl = whatsappLink(registrationMessage(result));
    const popup = window.open(whatsappUrl, '_blank');
    if (popup) popup.opener = null;
    setSuccess({ ...result, whatsappUrl, popupOpened: Boolean(popup) });
    toast({
      title: 'Cupo reservado',
      body: popup ? 'Abrimos WhatsApp para que confirmes tu pago.' : 'Continúa en WhatsApp para confirmar tu pago.',
    });
  };

  return (
    <div className="rounded-xs border border-line/25 p-5 md:p-8 lg:p-10">
      {/* El cambio a éxito no espera animaciones de salida: si WhatsApp abre otra pestaña, el rAF se pausa. */}
      {success ? (
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } }}>
          <SuccessPanel success={success} />
        </m.div>
      ) : (
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit(onValid)}
          aria-labelledby="form-titulo"
          className="grid gap-7 md:grid-cols-2 md:gap-x-6"
        >
          <div className="md:col-span-2">
            <h2 id="form-titulo" className="font-display text-xl font-semibold text-ink md:text-2xl">
              Tus datos de corredor
            </h2>
            <p className="mt-2 text-ink-muted">Todos los campos son obligatorios.</p>
          </div>

          <Field name="fullName" label="Nombre completo" error={errors.fullName?.message} className="md:col-span-2">
            {(a) => <input {...a} {...register('fullName')} type="text" autoComplete="name" className={inputClass(a['aria-invalid'])} />}
          </Field>

          <Field name="document" label="Documento de identidad" helper="Solo números, sin puntos." error={errors.document?.message}>
            {(a) => (
              <input
                {...a}
                {...register('document')}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                className={cx(inputClass(a['aria-invalid']), 'tabular')}
              />
            )}
          </Field>

          <Field name="phone" label="Celular / WhatsApp" helper="10 dígitos. Por aquí confirmamos tu cupo." error={errors.phone?.message}>
            {(a) => (
              <input
                {...a}
                {...register('phone')}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                className={cx(inputClass(a['aria-invalid']), 'tabular')}
              />
            )}
          </Field>

          <Field name="email" label="Correo electrónico" error={errors.email?.message}>
            {(a) => <input {...a} {...register('email')} type="email" autoComplete="email" className={inputClass(a['aria-invalid'])} />}
          </Field>

          <Field name="jerseySize" label="Talla de jersey" error={errors.jerseySize?.message}>
            {(a) => (
              <>
                <select {...a} {...register('jerseySize')} defaultValue="" className={cx(inputClass(a['aria-invalid']), 'appearance-none pr-12')}>
                  <option value="" disabled>
                    Elige tu talla
                  </option>
                  {JERSEY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
              </>
            )}
          </Field>

          <fieldset className="md:col-span-2" aria-describedby={errors.category ? 'f-category-error' : undefined}>
            <legend className="font-semibold text-ink">Categoría</legend>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              {ROUTE_ORDER.map((id) => {
                const route = ROUTES[id];
                return (
                  <label
                    key={id}
                    className={cx(
                      'flex min-h-[4.5rem] cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors duration-150',
                      'has-[:checked]:border-accent has-[:checked]:ring-1 has-[:checked]:ring-accent',
                      errors.category ? 'border-alert' : 'border-line/40 hover:border-line/70',
                    )}
                  >
                    <input
                      type="radio"
                      value={id}
                      {...register('category')}
                      aria-invalid={Boolean(errors.category)}
                      className="mt-1 size-5 shrink-0 accent-agua-viva"
                    />
                    <span>
                      <span className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                        <span
                          aria-hidden
                          className={cx('h-[3px] w-5 rounded-full', id === 'carrera' ? 'bg-route-carrera' : 'bg-route-travesia')}
                        />
                        {route.name}
                      </span>
                      <span className="tabular mt-0.5 block text-sm text-ink-muted">
                        {route.distanceKm} km y {formatThousands(route.ascentM)} m de ascenso
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            <FieldError id="f-category-error" message={errors.category?.message} />
          </fieldset>

          <fieldset className="border-t border-line/20 pt-7 md:col-span-2">
            <legend className="float-left w-full font-display text-lg font-semibold text-ink">Contacto de emergencia</legend>
            <p className="clear-left pt-1 text-sm text-ink-muted">Alguien que no corra contigo y conteste el día de la carrera.</p>
            <div className="mt-5 grid gap-7 md:grid-cols-2 md:gap-x-6">
              <Field name="emergencyName" label="Nombre" error={errors.emergencyName?.message}>
                {(a) => <input {...a} {...register('emergencyName')} type="text" autoComplete="off" className={inputClass(a['aria-invalid'])} />}
              </Field>
              <Field name="emergencyPhone" label="Celular" error={errors.emergencyPhone?.message}>
                {(a) => (
                  <input
                    {...a}
                    {...register('emergencyPhone')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="off"
                    className={cx(inputClass(a['aria-invalid']), 'tabular')}
                  />
                )}
              </Field>
            </div>
          </fieldset>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register('acceptTerms')}
                aria-invalid={Boolean(errors.acceptTerms)}
                aria-describedby={errors.acceptTerms ? 'f-acceptTerms-error' : undefined}
                className="mt-1 size-5 shrink-0 accent-agua-viva"
              />
              <span className="text-ink-muted">
                Acepto el reglamento del evento y autorizo el tratamiento de mis datos personales para gestionar mi inscripción,
                según la Ley 1581 de 2012.
              </span>
            </label>
            <FieldError id="f-acceptTerms-error" message={errors.acceptTerms?.message} />
          </div>

          {serverError ? (
            <div ref={errorBox} tabIndex={-1} role="alert" className="flex gap-3 rounded-sm border border-alert/70 p-4 focus:outline-none md:col-span-2">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-alert" aria-hidden />
              <div>
                <p className="font-semibold text-ink">No pudimos reservar tu cupo</p>
                <p className="mt-1 text-ink-muted">{serverError}</p>
                <a
                  href={whatsappLink(GENERAL_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(inlineLinkClass, 'mt-1 inline-flex min-h-11 items-center gap-2')}
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Escribir por WhatsApp
                </a>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-line/20 pt-7 md:col-span-2 md:flex-row md:items-center md:justify-between">
            <p className="text-ink-muted">
              Total <span className="tabular font-display text-xl font-semibold text-ink">{formatCOP(EVENT.price)}</span> COP
            </p>
            <button type="submit" disabled={isSubmitting} className={buttonClass('primary', 'lg', 'w-full md:w-auto')}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" aria-hidden />
                  Reservando tu cupo…
                </>
              ) : (
                'Reservar mi cupo'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
