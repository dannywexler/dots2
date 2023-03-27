archPackages=~/dots2/config/zsh/archPackages.txt

function selectAPackage() {
    echo $(yay -Slq | sk -m --preview-window right,66% --preview 'yay -Si {1}')
    # yay -Slq | fzf -m --preview-window right,66% --preview 'bat <(yay -Si {1}) <(yay -Fl {1} | awk "{print \$2}")' | xargs -ro yay -S
    # paru -Slq | fzf --multi --preview-window right,66% \ --preview '{paru -Si {1}; paru -Gc {1}}' | paru -S -
    # paru -Slq | fzf --multi --preview-window right,66% \ --preview '{paru -Si {1}; paru -Gc {1}}' | paru -S -

}

function yi() {
    selectedPackage=$(selectAPackage)
    echo $selectedPackage >> $archPackages
    yay -S --needed --noconfirm $selectedPackage
}

function ys() {
    yay -S --needed --noconfirm - < $archPackages
}
