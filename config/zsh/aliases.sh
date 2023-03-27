alias dots='cd ~/dots && nvim'
alias dots2='cd ~/dots2 && nvim'
alias v='nvim'
alias vc='cd ~/.config/nvim/ && nvim'
alias zc='cd ~/dots/zsh/ && nvim'
alias rustinstall='curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh'

function pacs(){
    for p in $(yay -Slq)
    do
        yay -Si $p | awk '/^(Description|Name)/' | choose -f ':' 1 | sd '\n ' ' --> ' | tee ~/archpaks.txt
    done
}
