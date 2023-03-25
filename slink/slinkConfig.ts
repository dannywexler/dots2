import 'zx/globals';
import { ConfigMapping } from './slink'

export const HOME = os.homedir()

export const linuxConfigMapping: ConfigMapping = {
    'fonts/': `${HOME}/.local/share/fonts`,
    git: true,
    kitty: true,
    'config/zsh/.zshrc': `${HOME}/.zshrc`
}
