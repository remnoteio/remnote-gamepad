<h1 align="center">
	<img src="https://raw.githubusercontent.com/coldenate/remnote-gamepad/main/assets/logo.svg" alt="RGC Logo" height="300px">
</h1>

<h3 align="center">
	🎮 RemNote Gamepad Controller: Connect your favorite game controller and use it in your Flashcard Queue!
</h3>

<p align="center">
	<a href="https://github.com/coldenate/remnote-gamepad/stargazers"><img src="https://img.shields.io/github/stars/coldenate/remnote-gamepad?colorA=363a4f&colorB=b7bdf8&style=for-the-badge" alt="GitHub Stars"></a>
	<a href="https://github.com/coldenate/remnote-gamepad/issues"><img src="https://img.shields.io/github/issues/coldenate/remnote-gamepad?colorA=363a4f&colorB=f5a97f&style=for-the-badge" alt="GitHub Issues"></a>
	<a href="https://github.com/coldenate/remnote-gamepad/contributors"><img src="https://img.shields.io/github/contributors/coldenate/remnote-gamepad?colorA=363a4f&colorB=a6da95&style=for-the-badge" alt="GitHub Contributors"></a>
</p>

<!-- <p align="center">
	<img src="https://raw.githubusercontent.com/coldenate/remnote-gamepad/main/.github/remnote-preview.gif" alt="RGC in Action">
</p> -->

## 👾 Overview

RemNote Gamepad Controller (RGC) is a RemNote Plugin that allows you to connect your favorite game controller to RemNote and use it to navigate your flashcard queue. RGC is designed to be simple and easy to use, so you can spend less time configuring and more time studying. (Works out of the box with most controllers!)

## 📅 Planned Features

- [ ] Controller Profiles for different controllers (e.g. You can have a profile for your Joycon (R) and another for your 8BitDo SN30 Pro)
  - [ ] Support for Nintendo Switch Joycons (L/R, as pair or individually)
- [ ] Indicator for when controller is connected
- ~~Better Button Binding UI~~ (cancelled - don't have the energy to implement this right now. If you find this is a priority, please let me know!)

Have an idea for a new feature? [Contribute](CONTRIBUTING.md) to RGC development!

## 📖 Documentation

### Predefined Button Mappings

Each queue interaction is mapped to one or more buttons:
| Queue Interaction | Button Binding Slot 1 | Button Binding Slot 2 | Button Binding Slot 3 |
|--------------------------|-----------------------|-----------------------|-----------------------|
| Answer Card As Again | North Button (Y) | North D-Pad | Left Trigger |
| Answer Card As Easy | South Button (A) | South D-Pad | Right Trigger |
| Answer Card As Good | East Button (B) | East D-Pad | Right Bumper |
| Answer Card As Hard | West Button (X) | West D-Pad | Left Bumper |
| Answer Card As Too Early | Start Button | | |
| Go Back To Previous Card | Select Button | | |

> [!NOTE]
> In parentheses are the buttons on an Xbox controller. For other controllers, please refer to the controller's button layout.

### Customizing Button Mappings

1. Open Plugin Settings and navigate to `Gamepad Queue Controller`
2. Select the button you want to assign a Queue Interaction to
3. Go back to studying and enjoy your new button mapping!

![Customizing Button Mappings](https://raw.githubusercontent.com/coldenate/remnote-gamepad/main/assets/customizing-button-mappings.gif)
_Theme used: [Catppuccin](https://remnote.com/plugins/catppuccin)_

(better method coming soon! for now, head to `Plugin Settings` to manually configure)

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
<!--

#### How do I customize the button mappings?

(coming soon! for now, head to `Plugin Settings` to manually configure) -->

#### My controller isn't working with RGC. What do I do?

If your controller isn't working with RGC, please open an issue. See the [Bugs and Issues](#🐛-bugs-and-issues) section for more information.

## 🐛 Bugs and Issues

Found a bug or want to suggest a feature? Please open an issue on our [GitHub Issues](https://github.com/coldenate/remnote-gamepad/issues) page. Your feedback is invaluable!

> [!NOTE]
> If you're reporting a bug, please include as much information as possible to help us reproduce the bug. I love detailed bug reports!
> PS. If you have an idea for a better name for the plugin, please let me know! 😭

---
