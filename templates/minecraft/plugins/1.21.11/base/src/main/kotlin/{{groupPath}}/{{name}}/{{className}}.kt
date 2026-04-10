package {{group}}.{{name}}

import org.bukkit.plugin.java.JavaPlugin

@Suppress("unused")
class {{className}} : JavaPlugin() {
	override fun onEnable() {
		logger.info("{{displayname}} has been enabled!")
	}

	override fun onDisable() {
		logger.info("{{displayname}} has been disabled!")
	}
}
