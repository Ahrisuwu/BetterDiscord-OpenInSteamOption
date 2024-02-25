/**
 * @name OpenInSteamOption
 * @author Ahrisuwu
 * @description Adds "Open Link In Steam" option to message context menu.
 * @version 1.0.0
 * @authorId 1108751432850604102
 */

module.exports = class {
      unpatchFunctions = [];
      steamDomains = [ "steamcommunity.com", "help.steampowered.com", "store.steampowered.com" ];

      start()
      {
            this.unpatchFunctions.push(BdApi.ContextMenu.patch("message", (contextMenu, message) => {

                  console.log(message);
                  let url = message.target.href ?? message.target.innerText;
                  if (!url || !this.isSteamURL(url)) return;

                  let menuItem = BdApi.ContextMenu.buildItem({ 
                        id: "open-link-in-steam", 
                        label: "Open Link In Steam", 
                        action: () => this.openLinkInSteam(url) 
                  });
                  contextMenu.props.children.push(menuItem);
            }));
            
            // Patches a context menu that opens when the user right-clicks a link in the Pinned Messages
            this.unpatchFunctions.push(BdApi.ContextMenu.patch("image-context", (contextMenu, message) => {

                  let url = message.href;
                  if (!url || !this.isSteamURL(url)) return;

                  let menuItem = BdApi.ContextMenu.buildItem({ 
                        id: "open-link-in-steam",
                        label: "Open Link In Steam", 
                        action: () => this.openLinkInSteam(url) 
                  });
                  contextMenu.props.children.props.children.push(menuItem);
            }));
      }

      stop()
      {
            this.unpatchFunctions.forEach(unpatchFn => unpatchFn());;
      }

      isSteamURL(url)
      {
            return this.steamDomains.some(domain => url.startsWith("https://" + domain));
      }

      openLinkInSteam(url)
      {
            window.open("steam://openurl/" + url);
      }
}
