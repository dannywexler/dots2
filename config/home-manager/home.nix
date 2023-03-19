{ config, pkgs, ...}: {
home.username = "danny";
home.homeDirectory = "/home/danny/";
home.stateVersion = "22.11";
programs.home-manager.enable = true;
home.packages = with pkgs; [

bottom
bridge-utils
clapper
dua
fd
ffmpeg_5-full
firefox
gcc
git
kitty
lf
libstdcxx5
libvirt
neovim
pcmanfm
protonvpn-gui
qemu
qemu_kvm
ripgrep
unar
unzip
virt-manager
vlc
wezterm
wget
xclip
yt-dlp
zsh

];
}
