{ config, pkgs, ...}: {
home.username = "danny";
home.homeDirectory = "/home/danny/";
home.stateVersion = "22.11";
programs.home-manager.enable = true;
home.packages = with pkgs; [

neovim
wezterm

]
}
