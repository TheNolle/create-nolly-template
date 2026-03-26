import { EmbedBuilder, Colors, MessageFlags } from 'discord.js'
import { Modal } from '../types/modal'
import { logger } from '../utils/logger'

export default {
  customId: 'exampleModal',
  async execute(_client, interaction) {
    const roleSelectValue = interaction.fields.getSelectedRoles('exampleRoleSelect', true)
    const userSelectValue = interaction.fields.getSelectedUsers('exampleUserSelect', true)
    const stringSelectMultiValue = interaction.fields.getStringSelectValues('exampleStringSelect')
    const channelSelectValue = interaction.fields.getSelectedChannels('exampleChannelSelect', true)
    try {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Modal Submission Received')
            .setDescription('Your modal submission has been received and processed successfully!')
            .addFields(
              { name: 'Role Select', value: roleSelectValue.size > 0 ? roleSelectValue.map(role => role).join(', ') : 'No roles selected', inline: true },
              { name: 'User Select', value: userSelectValue.size > 0 ? userSelectValue.map(user => user).join(', ') : 'No users selected', inline: true },
              { name: 'Multi-String Select', value: stringSelectMultiValue.length > 0 ? stringSelectMultiValue.join(', ') : 'No options selected', inline: true },
              { name: 'Channel Select', value: channelSelectValue.size > 0 ? channelSelectValue.map(channel => channel).join(', ') : 'No channels selected', inline: true }
            )
            .setColor(Colors.Green)
            .setFooter({ text: `Submitted by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
        ],
        flags: [MessageFlags.Ephemeral]
      })
    } catch (error) {
      logger.error('Error replying to modal submission:', error)
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('Error').setDescription('There was an error processing your modal submission. Please try again later.').setColor(Colors.Red)], flags: [MessageFlags.Ephemeral] })
    }
  }
} satisfies Modal