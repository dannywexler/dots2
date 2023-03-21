import 'zx/globals';
import { slinkAll } from '../../slink/slink'

const HOME = os.homedir();
const myDots = `${HOME}/dots2/`;

void async function() {
    $.verbose = false;
    if (os.platform() === 'linux') {
        await linuxSetup()
    }
    else {
        console.log('on windows')
    }
}()

async function linuxSetup() {
    cd(HOME)
    // await installNixHomeMgr()
    await archSetup()
    // await connectToNas()
    await $`${myDots}init.sh`
    await $`dconf load /org/gnome/ < ${myDots}config/gnome/gnome.conf`
    await slinkAll()
}

async function archSetup() {
    $.verbose = true
    await $`sudo pacman -S --needed --noconfirm sd reflector unar`
    await $`sudo sd '^#ParallelDownloads = 5' 'ParallelDownloads = 20' /etc/pacman.conf`
    await $`sudo sd '^#Color' 'Color\nILoveCandy' /etc/pacman.conf`
    await $`sudo reflector --country US --latest 20 --protocol https --sort rate --save /etc/pacman.d/mirrorlist`
    await yaySetup()
    await $`yay -Syu --needed --noconfirm`
    await gitClone('dannywexler', 'dots2', myDots)
}

async function yaySetup() {
    await $`sudo pacman -S --needed --noconfirm git base-devel`
    await $`git clone https://aur.archlinux.org/yay-bin`
    cd('yay-bin')
    await $`makepkg -si --needed --noconfirm`
    cd(HOME)
    await $`rm -rf yay-bin`
}

async function installNixHomeMgr() {
    echo('Installing Nix')
    echo('Downloading nix install script')
    await $`sh <(curl -L https://nixos.org/nix/install) --no-daemon --yes`
    const nixProfile = 'source ~/.nix-profile/etc/profile.d/nix.sh'
    $.prefix += nixProfile + '; '
    await $`echo ${nixProfile} >> ${HOME}/.bashrc`
    echo('Adding home manager channel')
    await $`nix-channel --add https://github.com/nix-community/home-manager/archive/master.tar.gz home-manager`
    echo('Updating channels')
    await $`nix-channel --update`
    echo('Installing home manager')
    await $`nix-shell '<home-manager>' -A install`
    echo('Home manager init')
    await $`home-manager switch`
    await cloneDots()
}

async function cloneDots() {
    echo('Cloning dots')
    await $`nix-env -i git`
    await gitClone('dannywexler', 'dots2', myDots)
    await $`nix-env -e git`
    await $`ln -sf ${myDots}config/home-manager/* ${HOME}/.config/home-manager`
    echo('Installing all home manager packages')
    await $`home-manager switch`
    echo('Linking applications')
    await $`ln -sf ${HOME}/.nix-profile/share/applications ${HOME}/.local/share`
    echo('Dots cloned and home manager packages installed')
}

// async function connectToNas() {
//     echo('Connecting to NAS');
//     for (const dir of ['archives', 'general', 'media']) {
//         echo('creating ', dir)
//         await $`sudo mkdir -p /nas/${dir}`
//         await addLineToFile(`192.168.0.248:/mnt/user/${dir} /nas/${dir} nfs defaults 0 0`, '/etc/fstab')
//     }
//     echo('Connected to NAS')
// }

async function gitClone(user: string, repo: string, dest?: string) {
    await $`git clone https://github.com/${user}/${repo} ${dest ?? ''}`
}

// async function addLineToFile(line: string, file: string) {
//     echo(`adding ${line} to ${file}`)
//     try {
//         if (await $`grep -Fqsx -- "${line}" "${file}"`) {
//             echo('already there')
//             return
//         }
//         try {
//             echo('trying to append without sudo first')
//             await $`echo ${line} >> ${file}`
//         }
//         catch (e) {
//             echo('that failed ', e)
//             echo('reruning with sudo tee')
//             await $`echo "${line}" | sudo tee --append "${file}`
//         }
//     }
//     catch (e) {
//         echo('error grepping ', e)
//     }
// }
