import { SlashCommandBuilder, EmbedBuilder, Colors, MessageFlags } from 'discord.js'
import type { Command } from '../types/command'

export default {
  data: new SlashCommandBuilder().setName('autocomplete').setDescription('Showcase the autocomplete feature').addStringOption(option => option.setName('input').setDescription('Type something...').setMinLength(2).setMaxLength(100).setRequired(true).setAutocomplete(true)),
  async autocomplete(_client, interaction) {
    const focused = interaction.options.getFocused(true)
    if (focused.name === 'input') {
      const choices = [
        { name: 'Apple', value: 'apple' },
        { name: 'Banana', value: 'banana' },
        { name: 'Cherry', value: 'cherry' },
        { name: 'Date', value: 'date' },
        { name: 'Elderberry', value: 'elderberry' },
        { name: 'Fig', value: 'fig' },
        { name: 'Grape', value: 'grape' },
        { name: 'Honeydew', value: 'honeydew' }
      ]
      const filtered = choices.filter(choice => choice.name.toLowerCase().includes(focused.value.toLowerCase())).slice(0, 25)
      await interaction.respond(filtered)
    }
  },
  async execute(_client, interaction) {
    const input = interaction.options.getString('input', true)
    await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`You wrote: **${input}**`).setColor(Colors.Green)], flags: [MessageFlags.Ephemeral] })
  }
} satisfies Command