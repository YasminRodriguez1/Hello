# Chrome App/Extension Internationalization

Around 70% of Internet users use Chrome today. Chrome is not just for browse ring. It is open, extendable and mobile. It's a great chance for developers to innovate and extend Chrome functionalities using all Chrome platform APIs facilities. The Chrome web store is full of great apps and extensions that could reach million of users and give a service that wasn't possible by other development platforms.

This article assumes you already worked with Chrome Apps/Extensions. Understanding how open is Chrome web store to a big variety of people, internationalizing becomes a must. It makes it easy to adapt to various languages and regions. Chrome provides the developer with a simple structure to internationalize his/her app/extension in few seconds.

This article will cover Chrome App/Extension i18n using a simple demo.  In order to test your browser in multiple languages, you need to set your [browser locale](https://developer.chrome.com/extensions/i18n#locales-testing).

The source code is available on [GitHub](https://github.com/NuhaKhaled/Hello)
Ground Work.

For today's purpose, let's create a simple Chrome extension called Hello (in English). It overrides the new Tab page, to show a Hello message to the user.

![newtab](https://cloud.githubusercontent.com/assets/626005/15888808/1b586816-2d71-11e6-9d57-63022aaf4b4d.png)

Create a new folder with the extension known essential files. For this step, we need a manifest, new tab HTML and CSS files and image for the icon.

![structure](https://cloud.githubusercontent.com/assets/626005/15888810/1b738c54-2d71-11e6-8f44-5097217bc556.png)

The manifest would just set extension's name, description, version and manifest version. Also, as we override the new tab page, we will set `newtab.html` for the new tab `chrome_url_overrides`:

``` json
{
  "name": "Hello",
  "description": "This is a demo extension for i18n.",
  "version": "1.0.0",
  "manifest_version": 2,
  "chrome_url_overrides" : {
    "newtab": "newtab.html"
 }
}
```

The `newtab.html` is the HTML page that overrides Chrome's new tab page. In this demo, you just need to have the header `h1` for "Hello" word.

``` html
<!DOCTYPE HTML>
<html>
  <head>
    <title id="page-title">Hello</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script type="text/javascript" src="js/newtab.js"></script>
  </head>
  <body>
    <h1 id="title"> </h1>
  </body>
</html>
```

`style.css` is a simple Stylesheet used to style the header:

``` css
#title {
  font-size: 12em !important;
  text-align: center;
  margin:0 auto;
  padding-top: 15%;
}
```

`newtab.js` sets `h1` with `id="title"` with "Hello" world dynamically on load. Setting the header dynamically would help in changing it easier in the future.

``` js
function setTitle() {
  document.getElementById('title').innerHTML = 'Hello!';
}

window.addEventListener('load', setTitle);
```

That's it, we are done with the ground work. In order to test it, go to `chrome://extensions/`, then enable developer mode. Load unpacked extension button will appear. Click on this button, and choose your extension's path.

![extensions](https://cloud.githubusercontent.com/assets/626005/15888802/1b365fbe-2d71-11e6-8a92-baa1690ccb4b.png)

![testarabic](https://cloud.githubusercontent.com/assets/626005/15888811/1b889888-2d71-11e6-90c1-4d4afc06d491.png)

Whatever your browser's language was, the extension's title and description will appear in the same way as they were set in the manifest. 

## Internationalizing the Extension

The extension initially supported just one locale `en`. Chrome Platform API gives the chance to internationalize even the title in very few steps. So let's upgrade the extension to be able to say Hello in all languages, based on user's language. First, you need to decide languages/regions the extension will support. Every language/region got a [Locale code](https://developer.chrome.com/webstore/i18n#localeTable). For this demo, I will support English ("en") and Arabic ("ar").

To localize the extension, you modify `manifest.json` and provide a *_locales* directory in your app's main directory. You provide your extension with `_locales/locale/messages.json` file for each chosen locale. Here's the file hierarchy for the extension that supports English ("en") and Arabic ("ar").

![helloextension](https://cloud.githubusercontent.com/assets/626005/15888805/1b472c18-2d71-11e6-992b-e335ad7e7230.png)

`messages.json` contains all the user-visible needed for localization.  You name each user-visible string and put it into the messages.json file. Each name would include a message, the translated string and a description (optional) that describes it for developer's documentation. In this demo, we just need to localize the title `appTitle` and description `appDesc`.

`_locales/en/messages.json`

``` json
{
  "appTitle": {
      "message": "Hello"
  },
  "appDesc": {
      "message": "This is a demo application.",
      "description":"The description of the application."
  }
}
```

`_locales/ar/messages.json`

``` json
{
  "appTitle": {
      "message": "مرحبا"
  },
  "appDesc": {
      "message": "هذه نسخة تجريبة.",
      "description":"The description of the application, displayed in the web store."
  }
}
```

If an extension has a *_locales* directory, the [manifest](https://developer.chrome.com/extensions/manifest) must define `default_locale`. Add to the manifest `"default_locale" : "en"`. The extension's manifest, CSS files, and JavaScript code use each string's name to get its localized version. `__MSG_messagename__` is used to refer to any message defined in the supported locales. 

To localize app listing, you need to change name and description in manifest to use `__MSG_appTitle__` and `__MSG_appDesc__`.

The manifest after the edits:

``` json
{
  "name": "__MSG_appTitle__",
  "description": "__MSG_appDesc__",
  "version": "1.0.0",
  "manifest_version": 2,
  "default_locale": "en",
  "chrome_url_overrides" : {
        "newtab": "newtab.html"
  }
}
```

The app listing is internationalized now. In case of testing:

Chrome with Arabic locale:

![testarabic](https://cloud.githubusercontent.com/assets/626005/15888811/1b889888-2d71-11e6-90c1-4d4afc06d491.png)

Chrome with English locale:

![extensions](https://cloud.githubusercontent.com/assets/626005/15888802/1b365fbe-2d71-11e6-8a92-baa1690ccb4b.png)

Now, it is time to change the "Hello" in the new tab. Chrome API provides this JavaScript method to fetch messages with:

`chrome.i18n.getMessage('messagename')`

You need to update `newtab.js`, so the value of the header would be `chrome.i18n.getMessage('appTitle')`, newtab.js updated:

``` js
function setTitle() {
  document.getElementById('title').innerHTML = chrome.i18n.getMessage('appTitle');
}

window.addEventListener('load', setTitle);
```

Test your app again now

Chrome with English locale:

![newtab](https://cloud.githubusercontent.com/assets/626005/15888808/1b586816-2d71-11e6-9d57-63022aaf4b4d.png)

Chrome with Arabic locale:

![arabic](https://cloud.githubusercontent.com/assets/626005/15888800/1b0c7adc-2d71-11e6-9c2d-07593dff395a.png)

On the last issue, Arabic is right to left language so the exclamation mark should be on the left! Chrome API provides you with predefined messages that will help in internationalization. 

`@@extension_id` The extension or app ID; you might use this string to construct URLs for resources inside the extension. Even unlocalized extensions can use this message. 

Note: You can't use this message in a manifest file.

`@@ui_locale` The current locale; you might use this string to construct locale-specific URLs.

`@@bidi_dir` The text direction for the current locale, either "ltr" for left-to-right languages such as English or "rtl" for right-to-left languages such as Japanese.

`@@bidi_reversed_dir` If the `@@bidi_dir` is "ltr", then this is "rtl"; otherwise, it's "ltr".

`@@bidi_start_edge` If the `@@bidi_dir` is "ltr", then this is "left"; otherwise, it's "right".

`@@bidi_end_edge` If the `@@bidi_dir` is "ltr", then this is "right"; otherwise, it's "left".

To change CSS direction to rtl, we need `@@bidi_dir`. So let's update CSS to add:

direction: `__MSG_@@bidi_dir__`;

`style.css`

``` css
#title {
  font-size: 12em !important;
  text-align: center;
  margin:0 auto;
  padding-top: 15%;
  direction: __MSG_@@bidi_dir__;
}
```

So now it is fixed, Chrome with Arabic locale:

![perfect](https://cloud.githubusercontent.com/assets/626005/15888809/1b649384-2d71-11e6-95d0-87fd6af574ac.png)

Chrome with English locale: 

![newtab](https://cloud.githubusercontent.com/assets/626005/15888808/1b586816-2d71-11e6-9d57-63022aaf4b4d.png)

Now it is possible to just add as many locales as you want without worrying about the functionality.

References:

- [chrome.i18n](https://developer.chrome.com/extensions/i18n)