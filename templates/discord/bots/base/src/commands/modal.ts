import { SlashCommandBuilder, EmbedBuilder, Colors, ModalBuilder, LabelBuilder, RoleSelectMenuBuilder, UserSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js'
import type { Command } from '../types/command'
import { logger } from '../utils/logger'

export default {
  data: new SlashCommandBuilder().setName('modal').setDescription('Replies with a modal!'),
  async execute(_client, interaction) {
    const modal = new ModalBuilder().setCustomId('exampleModal').setTitle('Example Modal')
    const roleSelect = new LabelBuilder()
      .setLabel('Example Role Select')
      .setDescription('This is an example role select')
      .setRoleSelectMenuComponent(
        new RoleSelectMenuBuilder()
          .setCustomId('exampleRoleSelect')
          .setPlaceholder('Select a role')
          .setMinValues(1)
          .setRequired(true)
      )
    const userSelect = new LabelBuilder()
      .setLabel('Example User Select')
      .setDescription('This is an example user select')
      .setUserSelectMenuComponent(
        new UserSelectMenuBuilder()
          .setCustomId('exampleUserSelect')
          .setPlaceholder('Select a user')
          .setMinValues(1)
          .setRequired(true)
      )
    const channelSelect = new LabelBuilder()
      .setLabel('Example Channel Select')
      .setDescription('This is an example channel select')
      .setChannelSelectMenuComponent(
        new ChannelSelectMenuBuilder()
          .setCustomId('exampleChannelSelect')
          .setPlaceholder('Select a channel')
          .setMinValues(1)
          .setRequired(true)
      )
    const stringSelectMulti = new LabelBuilder().setLabel('Example Multi-String Select').setDescription('This is an example multi-string select').setStringSelectMenuComponent(
      new StringSelectMenuBuilder().setCustomId('exampleStringSelect').setPlaceholder('Select an option').setMinValues(1).setMaxValues(3).setRequired(true).addOptions(
        new StringSelectMenuOptionBuilder().setLabel('Option 1').setValue('option1'),
        new StringSelectMenuOptionBuilder().setLabel('Option 2').setValue('option2'),
        new StringSelectMenuOptionBuilder().setLabel('Option 3').setValue('option3')
      )
    )
    const textDisplay = new TextDisplayBuilder().setContent('This is an example text display')
    modal.addLabelComponents(roleSelect, userSelect, channelSelect, stringSelectMulti).addTextDisplayComponents(textDisplay)
    try {
      await interaction.showModal(modal)
    } catch (error) {
      logger.error('Error showing modal:', error)
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('Error').setDescription('There was an error showing the modal. Please try again later.').setColor(Colors.Red)], flags: [MessageFlags.Ephemeral] })
    }
  }
} satisfies Command