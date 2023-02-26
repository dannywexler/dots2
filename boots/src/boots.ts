import 'zx/globals'

void async function() {
    if (os.platform() === 'linux') {
        console.log('Installing Nix')
        await installNixHomeMgr()
    }
    else {
        console.log('on windows')
    }
}()

async function installNixHomeMgr() {
    await $`sh <(curl -L https://nixos.org/nix/install) --no-daemon --yes`
    $.prefix += 'source ~/.nix-profile/etc/profile.d/nix.sh '
    await $`nix-channel --add https://github.com/nix-community/home-manager/archive/master.tar.gz home-manager`
    await $`nix-channel --update`
    await $`nix-shell '<home-manager>' -A install`
    await $`home-manager switch`
}
