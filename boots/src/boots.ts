import 'zx/globals'
$.verbose = false

const HOME = os.homedir()
const myDots = `${HOME}/dots2/`

void async function() {
    if (os.platform() === 'linux') {
        await linuxSetup()
    }
    else {
        console.log('on windows')
    }
}()

async function linuxSetup() {
    cd(HOME)
    echo('Installing Nix')
    await installNixHomeMgr()
    await cloneDots()
}

async function installNixHomeMgr() {
    await $`sh <(curl -L https://nixos.org/nix/install) --no-daemon --yes`
    $.prefix += 'source ~/.nix-profile/etc/profile.d/nix.sh; '
    await $`nix-channel --add https://github.com/nix-community/home-manager/archive/master.tar.gz home-manager`
    await $`nix-channel --update`
    await $`nix-shell '<home-manager>' -A install`
    await $`home-manager switch`
    await $`nix-env -i git`
}

async function cloneDots() {
    await gitClone('dannywexler', 'dots2', myDots)
    await fs.remove(`${HOME}/.config/nixpkgs`)
    await fs.ensureSymlink(`${myDots}config/nixpkgs`, `${HOME}/.config/nixpkgs`)
    await $`home-manager switch`
    echo('dots cloned and software installed')
}

async function gitClone(user: string, repo: string, dest?: string) {
    await $`git clone https://github.com/${user}/${repo} ${dest ?? ''}`
}
