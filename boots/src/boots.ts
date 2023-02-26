import 'zx/globals'

const myDots = '~/dots2/'
void async function() {
    if (os.platform() === 'linux') {
        await linuxSetup()
    }
    else {
        console.log('on windows')
    }
}()

async function linuxSetup() {
    // await $`cd ${os.homedir()}`
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
    await fs.remove('~/.config/nixpkgs')
    await fs.ensureSymlink(`${myDots}config/nixpkgs`, `~/.config/nixpkgs`)
    await $`home-manager switch`
    echo('dots cloned and software installed')
}

async function gitClone(user: string, repo: string, dest?: string) {
    await $`git clone https://github.com/${user}/${repo} ${dest ?? ''}`
}
