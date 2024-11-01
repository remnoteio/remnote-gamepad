<h1 align="center">
	<img src="https://raw.githubusercontent.com/remnoteio/remnote-gamepad/main/assets/logo.svg" alt="RGC Logo" height="300px">
</h1>

<h3 align="center">
	🎮 RemNote Gamepad Controller: Connect your favorite game controller and use it in your Flashcard Queue!
</h3>

<p align="center">
	<a href="https://github.com/remnoteio/remnote-gamepad/stargazers"><img src="https://img.shields.io/github/stars/remnoteio/remnote-gamepad?colorA=FFFFFF&colorB=506CF7&style=for-the-badge" alt="GitHub Stars"></a>
	<a href="https://github.com/remnoteio/remnote-gamepad/issues"><img src="https://img.shields.io/github/issues/remnoteio/remnote-gamepad?colorA=FFFFFF&colorB=506CF7&style=for-the-badge" alt="GitHub Issues"></a>
	<a href="https://github.com/remnoteio/remnote-gamepad/contributors"><img src="https://img.shields.io/github/contributors/remnoteio/remnote-gamepad?colorA=FFFFFF&colorB=506CF7&style=for-the-badge" alt="GitHub Contributors"></a>
</p>

<p align="center">
	<img src="https://raw.githubusercontent.com/remnoteio/remnote-gamepad/main/.github/usage.gif" alt="RGC in Action">
</p>

## 👾 Overview

RemNote Gamepad Controller (RGC) is a RemNote Plugin that allows you to connect your favorite game controller to RemNote and use it to navigate your flashcard queue. RGC is designed to be simple and easy to use, so you can spend less time configuring and more time studying. (Works out of the box with most controllers!)

### ⚠️ Known Issues

- When editing controller mappings on top of the flashcard queue, the controller will still interact with the flashcard queue. To avoid this, please close the flashcard queue before editing controller mappings. (This will be fixed in a future update)
- Queue does not work when plugin is loaded in Native Mode
- AI "Why True", "Why False", etc. explanations still count as the same card, so if you press a button, it will change the rating. (This will be fixed in a future update). Please either disable this plugin when using that feature or disable the AI explanations in the settings.

## 📖 Documentation

### Predefined Button Mappings

Each queue interaction is mapped to one or more buttons:

| Action               | Slot 1           | Slot 2      | Slot 3        |
| -------------------- | ---------------- | ----------- | ------------- |
| Forgot               | North Button (Y) | North D-Pad | Left Trigger  |
| Easily Recalled      | South Button (A) | South D-Pad | Right Trigger |
| Recalled with Effort | East Button (B)  | East D-Pad  | Right Bumper  |
| Partially Recalled   | West Button (X)  | West D-Pad  | Left Bumper   |
| Skip                 | Start Button     |             |               |
| Back                 | Select Button    |             |               |

> [!NOTE]
> In parentheses are the buttons on an Xbox controller. For other controllers, please refer to the controller's button layout.

### Customizing Button Mappings

1. Run `Customize Controls (Gamepad)` in the Command Palette
2. Select the button you want to assign a Queue Interaction to
3. Press desired button on your controller
4. Go back to studying and enjoy your new button mapping!

![Customizing Button Mappings](https://raw.githubusercontent.com/remnoteio/remnote-gamepad/main/.github/settings.gif)
_Theme used: [Catppuccin](https://remnote.com/plugins/catppuccin)_

### FAQ

#### How do I connect my controller to RemNote?

1. Download the latest version of RGC from the RemNote Plugin Store
2. Connect your controller to your computer via USB or Bluetooth
3. Open a Flashcard Queue in RemNote
4. Buttons should immediately start working!

#### How do I know if my controller is connected?

(coming soon!)

#### How do I know if my controller will work with RGC?

RGC is designed to work with most controllers out of the box. If you're unsure if your controller will work, please download and try. See the [My controller isn't working with RGC. What do I do?](#my-controller-isnt-working-with-rgc-what-do-i-do) section for more information.

#### How do I disconnect my controller from RemNote?

For this, you can either:

- Disconnect your controller from your computer
- Close the Flashcard Queue in RemNote
- Disable the plugin in `Plugins > Manage`

#### My controller isn't working with RGC. What do I do?

If your controller isn't working with RGC, please open an issue. See the [Bugs and Issues](#🐛-bugs-and-issues) section for more information.

#### What happens if I come across a dog gif and have to press a non-queue button?!?! What ever will I do?

RemNote will present you wil two buttons, one being the "primary" button (one with a colorful background-color) and the other being the "secondary" button (one with a white background-color). Whatever button you have bound to the "Easily Recalled" action will be the "primary" button, and the other will be the "secondary" button. Press the appropriate button to continue.

![Primary and Secondary Buttons](https://raw.githubusercontent.com/remnoteio/remnote-gamepad/main/.github/menus.gif)

## 📅 Planned Features

- [ ] Controller Profiles for different controllers (e.g. You can have a profile for your Joycon (R) and another for your 8BitDo SN30 Pro)
  - [ ] Support for Nintendo Switch Joycons (L/R, as pair or individually)
- [ ] Indicator for when controller is connected
- [x] Button Binding UI

Have an idea for a new feature? [Contribute](CONTRIBUTING.md) to RGC development!

## 🐛 Bugs and Issues

Found a bug or want to suggest a feature? Please open an issue on our [GitHub Issues](https://github.com/remnoteio/remnote-gamepad/issues) page. Your feedback is invaluable!

> [!NOTE]
> If you're reporting a bug, please include as much information as possible to help us reproduce the bug. I love detailed bug reports!
> PS. If you have an idea for a better name for the plugin, please let me know! 😭

---
