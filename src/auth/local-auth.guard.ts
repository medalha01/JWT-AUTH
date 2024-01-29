// src/auth/local-auth.guard.ts
import { AuthGuard } from '@nestjs/passport';

// This class is decorated with @Injectable(), indicating that it can be injected with dependencies.
export class LocalAuthGuard extends AuthGuard('local') {
  // This class extends the AuthGuard class and specifies 'local' as the strategy to be used for authentication.
}
