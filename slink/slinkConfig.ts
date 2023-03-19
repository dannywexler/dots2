import 'zx/globals';
import { ConfigMapping } from './slink'

export const HOME = os.homedir()
export const LINUX = os.platform() === 'linux'

export const configMapping: ConfigMapping = {
    'fonts/': LINUX ? path.join(HOME, '.local', 'share', 'fonts') : false,
    git: LINUX,
    kitty: LINUX,
    'config/zsh/.zshrc': LINUX ? path.join(HOME, '.zshrc') : false
}
