import type { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const serveStaticConfig: ServeStaticModuleOptions = {
  rootPath: path.join(process.cwd(), 'uploads'),
  serveRoot: `/${process.env.STATIC_PATH}`,
};
