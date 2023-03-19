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
    echo('Installing Nix')
    await installNixHomeMgr()
    await cloneDots()
    await connectToNas()
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

async function connectToNas() {
    echo('Connecting to NAS');
    for (const dir of ['archives', 'general', 'media']) {
        await addLineToFile(`192.168.0.248:/mnt/user/${dir} /nas/${dir} nfs defaults 0 0`, '/etc/fstab')
    }
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
