myZshDots="$HOME/dots2/config/zsh/zshrc.sh"
if [ -f $myZshDots ]; then
    source $myZshDots
    # print "sourced zsh dots from $myZshDots"
else
    print "No zsh dots found at $myZshDots"
fi

# pnpm
export PNPM_HOME="/home/danny/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
# pnpm end
