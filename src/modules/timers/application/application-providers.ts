import { Provider } from '@nestjs/common';
import {
  CreateTimerUseCase,
  PauseTimerUseCase,
  StartTimerUseCase,
} from './commands';
import { GetTimersUseCase } from './queries';

export const applicationProviders: Provider[] = [
  CreateTimerUseCase,
  StartTimerUseCase,
  PauseTimerUseCase,
  GetTimersUseCase,
];
