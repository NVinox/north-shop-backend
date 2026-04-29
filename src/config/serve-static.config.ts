import type { ServeStaticModuleOptions } from '@nestjs/serve-static';
import * as path from 'path';

export const serveStaticConfig: ServeStaticModuleOptions = {
  rootPath: path.join(process.cwd(), 'uploads'),
  serveRoot: 'static',
};
