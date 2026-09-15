import { z } from 'zod';

export const JERSEY_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export const CATEGORIES = ['carrera', 'travesia'] as const;

const mobile = (message: string) =>
  z
    .string()
    .trim()
    .transform((s) => s.replace(/[\s\-().]/g, '').replace(/^\+?57/, ''))
    .pipe(z.string().regex(/^3\d{9}$/, message));

export const registrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Escribe tu nombre completo.')
      .max(80, 'Usa máximo 80 caracteres.')
      .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, 'Incluye al menos un nombre y un apellido.'),
    document: z
      .string()
      .trim()
      .transform((s) => s.replace(/[.\s]/g, ''))
      .pipe(z.string().regex(/^\d{5,12}$/, 'Escribe solo los dígitos de tu documento (entre 5 y 12).')),
    email: z
      .string()
      .trim()
      .min(1, 'Escribe tu correo.')
      .email('Revisa el correo: debe verse como nombre@dominio.com.'),
    phone: mobile('Escribe un celular de 10 dígitos que empiece por 3.'),
    category: z.enum(CATEGORIES, { errorMap: () => ({ message: 'Elige Carrera o Travesía.' }) }),
    jerseySize: z.enum(JERSEY_SIZES, { errorMap: () => ({ message: 'Elige la talla de tu jersey.' }) }),
    emergencyName: z.string().trim().min(3, 'Escribe el nombre de tu contacto de emergencia.'),
    emergencyPhone: mobile('Escribe el celular de tu contacto: 10 dígitos que empiecen por 3.'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Acepta el reglamento y el tratamiento de datos para reservar tu cupo.' }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.phone && data.phone === data.emergencyPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['emergencyPhone'],
        message: 'Usa el número de otra persona: el tuyo ya está arriba.',
      });
    }
  });

export type RegistrationInput = z.input<typeof registrationSchema>;
export type Registration = z.output<typeof registrationSchema>;
