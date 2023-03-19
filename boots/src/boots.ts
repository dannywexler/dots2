import 'zx/globals';

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
    await installNixHomeMgr()
    await cloneDots()
    await connectToNas()
}

async function installNixHomeMgr() {
    echo('Installing Nix')
    echo('Downloading nix install script')
    await $`sh <(curl -L https://nixos.org/nix/install) --no-daemon --yes`
    $.prefix += 'source ~/.nix-profile/etc/profile.d/nix.sh; '
    echo('Adding home manager channel')
    await $`nix-channel --add https://github.com/nix-community/home-manager/archive/master.tar.gz home-manager`
    echo('Updating channels')
    await $`nix-channel --update`
    echo('Installing home manager')
    await $`nix-shell '<home-manager>' -A install`
    echo('Home manager init')
    await $`home-manager switch`
    echo('Installing git')
    await $`nix-env -i git`
}

async function cloneDots() {
    echo('Cloning dots')
    await gitClone('dannywexler', 'dots2', myDots)
    await $`ln -sf ${myDots}config/nixpkgs ${HOME}/.config/nixpkgs`
    echo('Installing all home manager packages')
    await $`home-manager switch`
    echo('Dots cloned and home manager packages installed')
}

async function connectToNas() {
    echo('Connecting to NAS');
    for (const dir of ['archives', 'general', 'media']) {
        await addLineToFile(`192.168.0.248:/mnt/user/${dir} /nas/${dir} nfs defaults 0 0`, '/etc/fstab')
    }
    echo('Connected to NAS')
}

async function gitClone(user: string, repo: string, dest?: string) {
    await $`git clone https://github.com/${user}/${repo} ${dest ?? ''}`
}

async function addLineToFile(line: string, file: string) {
    echo(`adding ${line} to ${file}`)
    if (await $`grep -Fqsx -- "${line}" "${file}"`) {
        echo('already there')
        return
    }
    try {
        echo('trying to append without sudo first')
        await $`echo ${line} >> ${file}`
    }
    catch (e) {
        echo('that failed, reruning with sudo tee')
        await $`echo "${line}" | sudo tee -- append "${file}`
    }
}
