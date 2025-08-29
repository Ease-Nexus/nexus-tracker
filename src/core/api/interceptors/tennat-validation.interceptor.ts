import { ZodValidationInterceptor } from 'src/main/interceptors';
import { z } from 'zod';

export const tenantValidationInterceptor = new ZodValidationInterceptor({
  headerSchema: z.object({
    'x-tenant-code': z.string(),
  }),
});
