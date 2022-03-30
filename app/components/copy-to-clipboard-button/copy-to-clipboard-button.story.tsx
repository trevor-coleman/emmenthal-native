import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import { CopyToClipboardButton } from "./copy-to-clipboard-button"

storiesOf("CopyToClipboardButton", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <CopyToClipboardButton style={{ backgroundColor: color.error }} />
      </UseCase>
    </Story>
  ))
