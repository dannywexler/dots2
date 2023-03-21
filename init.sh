function addToFile() {
    LINE=$1
    FILE=$2
    grep -Fqsx -- "$LINE" "$FILE" || echo "$LINE" | sudo tee --append "$FILE"
}

function connectToNas() {
    echo 'connectToNas'
    sudo mkdir -p /nas/archives
    addToFile '192.168.0.248:/mnt/user/archives /nas/archives nfs defaults 0 0' /etc/fstab
    sudo mkdir -p /nas/general
    addToFile '192.168.0.248:/mnt/user/general /nas/general nfs defaults 0 0' /etc/fstab
    sudo mkdir -p /nas/media
    addToFile '192.168.0.248:/mnt/user/media /nas/media nfs defaults 0 0' /etc/fstab
    sudo mkdir -p /nas/vms
    addToFile '192.168.0.248:/mnt/user/vms /nas/vms nfs defaults 0 0' /etc/fstab
}

function homeFolderCleanup() {
    echo 'homeFolderCleanup'
    mkdir $HOME/bins
    rm -rf $HOME/Desktop/
    mv $HOME/Documents/ $HOME/docs
    mv $HOME/Downloads/ $HOME/dls
    rm -rf $HOME/Music/
    rm -rf $HOME/Pictures/
    rm -rf $HOME/Videos/
}

# function hpPrinterSetup() {
#     hp-setup 192.168.0.219
# }

function iconsAndThemes() {
    echo 'iconsAndThemes'
    [ -d ~/.local/share/icons ] || mkdir -p ~/.local/share/icons
    cd ~/dots2/icons
    unar -q kora.zip -o ~/.local/share/icons/

    [ -d ~/.themes/ ] || mkdir -p ~/.themes/
    cd ~/dots2/themes
    unar -q Skeuos-Blue-Dark.zip -o ~/.themes
    cd
}

function waterfoxSetup() {
    echo 'waterfoxSetup'
    if [[ -d ~/waterfox ]]; then
        echo 'Waterfox already installed'
    else
        wget -q https://cdn1.waterfox.net/waterfox/releases/G5.1/Linux_x86_64/waterfox-G5.1.tar.bz2
        unar -q *.bz2
        rm *.bz2
        echo 'WaterFox downloaded'
        ln -s ~/dots/applications/waterfox.desktop ~/.local/share/applications
        # desktop-file-validate /usr/share/applications/waterfox.desktop
        sudo update-desktop-database
        echo 'WaterFox installed'
    fi
}


connectToNas &&\
homeFolderCleanup &&\
iconsAndThemes &&\
# waterfoxSetup &&\
echo 'updating font cache' && fc-cache -f -v > /dev/null &&\
git clone https://github.com/dannywexler/neovim.git ~/.config/nvim
# chsh -s $(which zsh)
