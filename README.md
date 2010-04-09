Greasy Thug v0.2.1
==================
I've been called a greasy thug, too. It never stops hurting. So here's what we're gonna do: We're gonna grease ourselves up real good and trash that place with a baseball bat. - Homer

Enables you to use JavaScript and jQuery to alter web pages, like Greasemonkey. Unlike Greasemonkey, Greasy Thug provides a built in console with a full command history. This allows for quick one-off scripts to be created and saved to execute at each subsequent visit to a page.

Because this is an early release there is lots of logging info in the console. This will show you what scripts are running and when. Everything is still pretty crude, but we are trying hard to improve and are interested in hearing any feedback!

Creating Your First Page-mod
============================
After installing Greasy Thug, click the console icon browser action that has been added to your Chrome toolbar. You will see a console window appear in the top left of your screen.

Type `alert("Hello World")` into the text area in the console. Click `Execute`. This will execute the script you just typed in. Now click `Save Previous`. This will save the previously executed script to be run every time you return to the page.

The 'Scripts' window will appear showing the script you just added. If you have multiple scripts you can rearrange the order in which they execute by dragging and dropping. You can also toggle which scripts should execute with the checkbox. Scripts can be deleted by clicking on the 'X'.

Publishing and Sharing
======================
After you develop a cool page mod you can publish it to greasythug.net. In order to do so you need to sign up for an account on greasythug.net, go ahead, I'll wait. Ok, now go to the page that you've written your script for. Open the script manager and double click on the script that you want to publish, it will show up in an edit window. Near the top of the window is a publish button. Just click "Publish" and it's up on greasythug.net! (you did sign up for an account, right?)

Installing Shared Scripts
=========================
Like Greasefire, Greasy Thug allows you to install scripts for pages as you browse. Open up the control panel and click on "Scripts from greasythug.net". It will pop-up a list of scripts that have been saved (if any) for the specific domain.

GM_* Compatability
==================
GM_xmlhttpRequest and GM_log are compatable with Greasy Thug. GM_getValue, GM_setValue and GM_registerMenuCommand are not compatable at this time.


Happy Thugging!
