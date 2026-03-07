const {
  Client, GatewayIntentBits, PermissionFlagsBits, ChannelType,
  REST, Routes, SlashCommandBuilder, EmbedBuilder
} = require('discord.js');

const TOKEN     = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const OWNER_ID  = process.env.OWNER_ID;
const GUILD_ID  = process.env.GUILD_ID;

if (!TOKEN)     { console.error('❌ DISCORD_TOKEN em falta!'); process.exit(1); }
if (!CLIENT_ID) { console.error('❌ CLIENT_ID em falta!');     process.exit(1); }
if (!OWNER_ID)  { console.error('❌ OWNER_ID em falta!');      process.exit(1); }
if (!GUILD_ID)  { console.error('❌ GUILD_ID em falta!');      process.exit(1); }

// ─── CLIENT ───────────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// ─── COMMANDS ─────────────────────────────────────────────────────────────────
const commands = [
  new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Monta o servidor inteiro (owner only)'),

  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verifica um membro (warden only)')
    .addUserOption(o => o.setName('utilizador').setDescription('Membro a verificar').setRequired(true))
    .addIntegerOption(o => o.setName('floor').setDescription('Floor mais alto alcançado').setRequired(true)),

  new SlashCommandBuilder()
    .setName('role')
    .setDescription('Auto-atribui uma role')
    .addStringOption(o =>
      o.setName('nome').setDescription('Nome da role').setRequired(true)
        .addChoices(
          { name: '🎯 Distractor',   value: '🎯 Distractor' },
          { name: '🔧 Extractor',    value: '🔧 Extractor' },
          { name: '💊 Support',      value: '💊 Support' },
          { name: '🗡️ Frontliner',   value: '🗡️ Frontliner' },
          { name: '👁️ Recon',        value: '👁️ Recon' },
          { name: '🛡️ Protector',    value: '🛡️ Protector' },
          { name: '🐱 Little Mime',  value: '🐱 little mime' },
          { name: '🌿 Sprout',       value: '🌿 sprout' },
          { name: '🐚 Shelly',       value: '🐚 shelly' },
          { name: '📺 Broken TV',    value: '📺 broken tv' },
          { name: '🎈 Astro',        value: '🎈 astro' },
          { name: '🧸 Goob',         value: '🧸 goob' },
          { name: '🐱 Cosmo',        value: '🐱 cosmo' },
          { name: '🌸 Bobette',      value: '🌸 bobette' },
          { name: '🐶 Vee',          value: '🐶 vee' },
          { name: '🎀 Fly',          value: '🎀 fly' },
          { name: '🏆 Floor Legend', value: 'Floor Legend' },
          { name: '🎲 Chaos Agent',  value: 'Chaos Agent' },
          { name: '💀 Twisted Bait', value: 'Twisted Bait' },
          { name: '⚡ Active',       value: 'active' },
          { name: '🎨 Decorator',    value: 'decorator' },
        )
    ),

  new SlashCommandBuilder()
    .setName('rolemenu')
    .setDescription('Posta o menu de roles neste canal (warden only)'),

  new SlashCommandBuilder()
    .setName('runresult')
    .setDescription('Posta um resultado de run')
    .addIntegerOption(o => o.setName('floor').setDescription('Floor alcançado').setRequired(true))
    .addStringOption(o => o.setName('equipa').setDescription('Nomes da equipa separados por vírgula').setRequired(true)),

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicka um membro (warden only)')
    .addUserOption(o => o.setName('utilizador').setDescription('Membro a kickar').setRequired(true))
    .addStringOption(o => o.setName('razao').setDescription('Razão').setRequired(false)),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um membro (warden only)')
    .addUserOption(o => o.setName('utilizador').setDescription('Membro a banir').setRequired(true))
    .addStringOption(o => o.setName('razao').setDescription('Razão').setRequired(false)),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lista todos os comandos'),
].map(c => c.toJSON());

// ─── SERVER STRUCTURE ─────────────────────────────────────────────────────────
const ROLES = [
  { name: 'TTS Bot',          color: '#95a5a6', hoist: false },
  { name: 'Ticket Tool',      color: '#95a5a6', hoist: false },
  { name: 'active',           color: '#f1c40f', hoist: false },
  { name: 'Server Booster',   color: '#f47fff', hoist: false },
  { name: 'decorator',        color: '#9b59b6', hoist: false },
  { name: 'Chaos Agent',      color: '#e67e22', hoist: false },
  { name: 'Twisted Bait',     color: '#e74c3c', hoist: false },
  { name: 'Floor Legend',     color: '#f39c12', hoist: false },
  { name: '🐱 little mime',   color: '#bdc3c7', hoist: false },
  { name: '🌿 sprout',        color: '#2ecc71', hoist: false },
  { name: '🐚 shelly',        color: '#1abc9c', hoist: false },
  { name: '📺 broken tv',     color: '#7f8c8d', hoist: false },
  { name: '🎈 astro',         color: '#3498db', hoist: false },
  { name: '🧸 goob',          color: '#9b59b6', hoist: false },
  { name: '🐱 cosmo',         color: '#e91e63', hoist: false },
  { name: '🌸 bobette',       color: '#ff69b4', hoist: false },
  { name: '🐶 vee',           color: '#e74c3c', hoist: false },
  { name: '🎀 fly',           color: '#e91e63', hoist: false },
  { name: '🪨 Floor Crawler', color: '#7f8c8d', hoist: false },
  { name: '🌿 Deep Runner',   color: '#2ecc71', hoist: false },
  { name: '❄️ Floor Veteran', color: '#3498db', hoist: false },
  { name: '⚡ Elite Delver',  color: '#f39c12', hoist: false },
  { name: '💀 Abyss Walker',  color: '#e74c3c', hoist: false },
  { name: '🎯 Distractor',    color: '#e74c3c', hoist: true },
  { name: '🔧 Extractor',     color: '#3498db', hoist: true },
  { name: '💊 Support',       color: '#9b59b6', hoist: true },
  { name: '🗡️ Frontliner',    color: '#e67e22', hoist: true },
  { name: '👁️ Recon',         color: '#1abc9c', hoist: true },
  { name: '🛡️ Protector',     color: '#f39c12', hoist: true },
  { name: '✅ Verified Runner', color: '#2ecc71', hoist: true },
  { name: '📋 Run Leader',    color: '#f39c12', hoist: true },
  { name: '🛡️ Warden',        color: '#e74c3c', hoist: true, permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageRoles] },
  { name: '🤝 Co-Owner',      color: '#9b59b6', hoist: true, permissions: [PermissionFlagsBits.Administrator] },
  { name: '👑 Owner',         color: '#f1c40f', hoist: true, permissions: [PermissionFlagsBits.Administrator] },
];

const CATEGORIES = [
  { name: '📢 INFO', channels: [
    { name: '📣announcements',         type: ChannelType.GuildText, readOnly: true },
    { name: '📋update-log',            type: ChannelType.GuildText, readOnly: true },
    { name: '⭐twisted-board',         type: ChannelType.GuildText, readOnly: true },
    { name: '❓guessing-the-new-toon', type: ChannelType.GuildText },
    { name: '🎥hf-proof-vid',          type: ChannelType.GuildText },
  ]},
  { name: '🔒 VERIFICATION', channels: [
    { name: '🚪waiting-room',       type: ChannelType.GuildText, isWaiting: true },
    { name: '📷floor-verification', type: ChannelType.GuildText, isVerification: true },
  ]},
  { name: '🏃 RUNS', channels: [
    { name: '🎪random-runs',       type: ChannelType.GuildText, verifiedOnly: true },
    { name: '💎run-results',       type: ChannelType.GuildText, verifiedOnly: true },
    { name: '🔗link-ps',           type: ChannelType.GuildText, verifiedOnly: true },
    { name: '📅run-scheduling',    type: ChannelType.GuildText, verifiedOnly: true },
    { name: '👥looking-for-group', type: ChannelType.GuildText, verifiedOnly: true },
  ]},
  { name: '📖 GUIDES', channels: [
    { name: '🐱toon-guide',       type: ChannelType.GuildText, readOnly: true },
    { name: '🎯distractor-guide', type: ChannelType.GuildText, readOnly: true },
    { name: '🧁healer-guide',     type: ChannelType.GuildText, readOnly: true },
    { name: '🔧extractor-guide',  type: ChannelType.GuildText, readOnly: true },
    { name: '📝support-guide',    type: ChannelType.GuildText, readOnly: true },
    { name: '🗡️frontliner-guide', type: ChannelType.GuildText, readOnly: true },
  ]},
  { name: '💬 CONVÍVIO', channels: [
    { name: '💬general',              type: ChannelType.GuildText, verifiedOnly: true },
    { name: '🔮randoms',              type: ChannelType.GuildText, verifiedOnly: true },
    { name: '😂memes',                type: ChannelType.GuildText, verifiedOnly: true },
    { name: '🎨fan-art',              type: ChannelType.GuildText, verifiedOnly: true },
    { name: '🖼️screenshots',          type: ChannelType.GuildText, verifiedOnly: true },
    { name: '🎵music-vibes',          type: ChannelType.GuildText, verifiedOnly: true },
    { name: '📸media',                type: ChannelType.GuildText, verifiedOnly: true },
    { name: '📓guide-for-our-server', type: ChannelType.GuildText, readOnly: true },
  ]},
  { name: '📜 RULES', channels: [
    { name: '📜rules',      type: ChannelType.GuildText, readOnly: true },
    { name: '☕chat-rules', type: ChannelType.GuildText, readOnly: true },
  ]},
  { name: '🔊 VOICE', channels: [
    { name: '🏠 lobby',             type: ChannelType.GuildVoice, verifiedOnly: true },
    { name: '🏃 run room 1',        type: ChannelType.GuildVoice, verifiedOnly: true },
    { name: '🏃 run room 2',        type: ChannelType.GuildVoice, verifiedOnly: true },
    { name: '📝 strategy planning', type: ChannelType.GuildVoice, verifiedOnly: true },
    { name: '🎨 chill & draw',      type: ChannelType.GuildVoice, verifiedOnly: true },
    { name: '🎵 music vc',          type: ChannelType.GuildVoice, verifiedOnly: true },
    { name: '🎙️ afk',               type: ChannelType.GuildVoice },
  ]},
  { name: '🛡️ STAFF ONLY', staffOnly: true, channels: [
    { name: '🛡️mod-chat',         type: ChannelType.GuildText },
    { name: '📋verification-log', type: ChannelType.GuildText },
    { name: '⚠️mod-actions',      type: ChannelType.GuildText },
  ]},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getRole  = (guild, name) => guild.roles.cache.find(r => r.name === name);
const hasRole  = (member, name) => member.roles.cache.some(r => r.name === name);
const isStaff  = (member) =>
  hasRole(member, '🛡️ Warden') ||
  hasRole(member, '👑 Owner') ||
  hasRole(member, '🤝 Co-Owner') ||
  member.id === OWNER_ID;

// ─── READY — register commands ────────────────────────────────────────────────
client.once('ready', async () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log(`✅ ${commands.length} slash commands registados no servidor.`);
  } catch (err) {
    console.error('❌ Erro ao registar commands:', err.message);
  }
});

// ─── INTERACTIONS ─────────────────────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName, guild, member } = interaction;

  // /setup
  if (commandName === 'setup') {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: '❌ Só o owner pode usar este comando.', ephemeral: true });
    }
    await interaction.reply({ content: '⚙️ A montar o servidor... aguarda.', ephemeral: true });
    try {
      const existingChannels = await guild.channels.fetch();
      for (const [, ch] of existingChannels) await ch.delete().catch(() => {});
      const existingRoles = await guild.roles.fetch();
      for (const [, role] of existingRoles) {
        if (role.name !== '@everyone' && !role.managed) await role.delete().catch(() => {});
      }
      const createdRoles = {};
      for (const rd of ROLES) {
        const r = await guild.roles.create({ name: rd.name, color: rd.color, hoist: rd.hoist || false, permissions: rd.permissions || [] });
        createdRoles[rd.name] = r;
      }
      const verifiedRole = createdRoles['✅ Verified Runner'];
      const wardenRole   = createdRoles['🛡️ Warden'];
      const ownerRole    = createdRoles['👑 Owner'];
      const everyone     = guild.roles.everyone;

      for (const cat of CATEGORIES) {
        const catPerms = cat.staffOnly ? [
          { id: everyone.id,   deny:  [PermissionFlagsBits.ViewChannel] },
          { id: wardenRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          { id: ownerRole.id,  allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        ] : [];

        const category = await guild.channels.create({ name: cat.name, type: ChannelType.GuildCategory, permissionOverwrites: catPerms });

        for (const ch of cat.channels) {
          let perms = [];
          if (cat.staffOnly) {
            perms = [
              { id: everyone.id,   deny:  [PermissionFlagsBits.ViewChannel] },
              { id: wardenRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
              { id: ownerRole.id,  allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            ];
          } else if (ch.isWaiting) {
            perms = [{ id: everyone.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] }];
          } else if (ch.isVerification) {
            perms = [
              { id: everyone.id,     allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
              { id: verifiedRole.id, deny:  [PermissionFlagsBits.ViewChannel] },
            ];
          } else if (ch.verifiedOnly) {
            perms = [
              { id: everyone.id,     deny:  [PermissionFlagsBits.ViewChannel] },
              { id: verifiedRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
              { id: wardenRole.id,   allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
              { id: ownerRole.id,    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            ];
          } else if (ch.readOnly) {
            perms = [
              { id: everyone.id,   allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
              { id: wardenRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
              { id: ownerRole.id,  allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            ];
          } else {
            perms = [{ id: everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }];
          }
          await guild.channels.create({ name: ch.name, type: ch.type, parent: category.id, permissionOverwrites: perms }).catch(() => {});
        }
      }
      const ownerMember = await guild.members.fetch(interaction.user.id);
      await ownerMember.roles.add(ownerRole).catch(() => {});
      await interaction.followUp({ content: '✅ **Servidor montado!** Usa `/verify` para verificar membros.', ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.followUp({ content: '❌ Erro: ' + err.message, ephemeral: true });
    }
    return;
  }

  // /verify
  if (commandName === 'verify') {
    if (!isStaff(member)) return interaction.reply({ content: '❌ Só Wardens.', ephemeral: true });
    const target = interaction.options.getMember('utilizador');
    const floor  = interaction.options.getInteger('floor');
    const vr = getRole(guild, '✅ Verified Runner');
    if (vr) await target.roles.add(vr).catch(console.error);
    let badge = null;
    if      (floor >= 40) badge = getRole(guild, '💀 Abyss Walker');
    else if (floor >= 30) badge = getRole(guild, '⚡ Elite Delver');
    else if (floor >= 20) badge = getRole(guild, '❄️ Floor Veteran');
    else if (floor >= 10) badge = getRole(guild, '🌿 Deep Runner');
    else                  badge = getRole(guild, '🪨 Floor Crawler');
    if (badge) await target.roles.add(badge).catch(console.error);
    const log = guild.channels.cache.find(c => c.name === '📋verification-log');
    if (log) log.send(`✅ **${target.user.tag}** verificado no Floor **${floor}** por ${interaction.user.tag}`);
    const general = guild.channels.cache.find(c => c.name === '💬general');
    if (general) general.send(`✅ **${target.user.username}** entrou na crew — Floor **${floor}**. Bem-vindo! 🎯`);
    return interaction.reply({ content: `✅ ${target.user.username} verificado no Floor ${floor}!`, ephemeral: true });
  }

  // /role
  if (commandName === 'role') {
    if (!hasRole(member, '✅ Verified Runner')) return interaction.reply({ content: '❌ Precisas de ser verificado primeiro.', ephemeral: true });
    const roleName = interaction.options.getString('nome');
    const role = getRole(guild, roleName);
    if (!role) return interaction.reply({ content: '❌ Role não encontrada.', ephemeral: true });
    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      return interaction.reply({ content: `🔄 Role **${roleName}** removida.`, ephemeral: true });
    } else {
      await member.roles.add(role);
      return interaction.reply({ content: `✅ Agora tens a role **${roleName}**!`, ephemeral: true });
    }
  }

  // /rolemenu
  if (commandName === 'rolemenu') {
    if (!isStaff(member)) return interaction.reply({ content: '❌ Só staff.', ephemeral: true });
    const embed = new EmbedBuilder()
      .setColor('#7b4fcf')
      .setTitle("🎮 Escolhe as tuas roles!")
      .setDescription(
        '**GAMEPLAY**\n`/role` → 🎯 Distractor • 🔧 Extractor • 💊 Support • 🗡️ Frontliner • 👁️ Recon • 🛡️ Protector\n\n' +
        '**TOON FAVORITO**\n`/role` → 🐱 Little Mime • 🌿 Sprout • 🐚 Shelly • 📺 Broken TV • 🎈 Astro • 🧸 Goob • 🐱 Cosmo • 🌸 Bobette • 🐶 Vee • 🎀 Fly\n\n' +
        '**PERSONALIDADE**\n`/role` → 🏆 Floor Legend • 🎲 Chaos Agent • 💀 Twisted Bait • ⚡ Active • 🎨 Decorator'
      );
    await interaction.channel.send({ embeds: [embed] });
    return interaction.reply({ content: '✅ Menu postado!', ephemeral: true });
  }

  // /runresult
  if (commandName === 'runresult') {
    if (!hasRole(member, '✅ Verified Runner')) return interaction.reply({ content: '❌ Verificados apenas.', ephemeral: true });
    const floor  = interaction.options.getInteger('floor');
    const equipa = interaction.options.getString('equipa');
    const ch = guild.channels.cache.find(c => c.name === '💎run-results');
    if (!ch) return interaction.reply({ content: '❌ Canal não encontrado.', ephemeral: true });
    const embed = new EmbedBuilder()
      .setColor('#c8a84b')
      .setTitle(`🏆 Run Result — Floor ${floor}`)
      .addFields(
        { name: 'Floor', value: `${floor}`, inline: true },
        { name: 'Equipa', value: equipa, inline: true },
        { name: 'Por', value: interaction.user.username, inline: true },
      ).setTimestamp();
    await ch.send({ embeds: [embed] });
    return interaction.reply({ content: '✅ Resultado postado!', ephemeral: true });
  }

  // /kick
  if (commandName === 'kick') {
    if (!isStaff(member)) return interaction.reply({ content: '❌ Só Wardens.', ephemeral: true });
    const target = interaction.options.getMember('utilizador');
    const reason = interaction.options.getString('razao') || 'Sem razão';
    await target.kick(reason);
    const log = guild.channels.cache.find(c => c.name === '⚠️mod-actions');
    if (log) log.send(`👢 **${target.user.tag}** kickado por **${interaction.user.tag}** — ${reason}`);
    return interaction.reply({ content: `👢 ${target.user.username} kickado.`, ephemeral: true });
  }

  // /ban
  if (commandName === 'ban') {
    if (!isStaff(member)) return interaction.reply({ content: '❌ Só Wardens.', ephemeral: true });
    const target = interaction.options.getMember('utilizador');
    const reason = interaction.options.getString('razao') || 'Sem razão';
    await target.ban({ reason });
    const log = guild.channels.cache.find(c => c.name === '⚠️mod-actions');
    if (log) log.send(`🔨 **${target.user.tag}** banido por **${interaction.user.tag}** — ${reason}`);
    return interaction.reply({ content: `🔨 ${target.user.username} banido.`, ephemeral: true });
  }

  // /help
  if (commandName === 'help') {
    const embed = new EmbedBuilder()
      .setColor('#7b4fcf')
      .setTitle("🎮 Dandy's World Bot — Comandos")
      .addFields(
        { name: '/setup',      value: 'Monta o servidor inteiro *(owner only)*' },
        { name: '/verify',     value: 'Verifica membro + badge de floor *(warden only)*' },
        { name: '/role',       value: 'Escolhe a tua role' },
        { name: '/rolemenu',   value: 'Posta menu de roles *(warden only)*' },
        { name: '/runresult',  value: 'Posta resultado de run' },
        { name: '/kick /ban',  value: 'Moderação *(warden only)*' },
      );
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

// ─── AUTO WELCOME ─────────────────────────────────────────────────────────────
client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.channels.cache.find(c => c.name === '🚪waiting-room');
  if (!channel) return;
  const verif = member.guild.channels.cache.find(c => c.name === '📷floor-verification');
  channel.send(
    `👁️ **${member.user.username}** chegou.\n\n` +
    `Este servidor é para jogadores sérios de Dandy's World.\n` +
    `Vai a ${verif ? `<#${verif.id}>` : '#floor-verification'} e posta o teu floor mais alto.\n\n` +
    `*Tens 48 horas. Sem verificação = saída automática.*`
  );
  setTimeout(async () => {
    const fresh = await member.guild.members.fetch(member.id).catch(() => null);
    if (!fresh) return;
    if (!fresh.roles.cache.some(r => r.name === '✅ Verified Runner')) {
      await fresh.kick('Não verificou em 48 horas').catch(console.error);
      const log = member.guild.channels.cache.find(c => c.name === '📋verification-log');
      if (log) log.send(`🚪 **${member.user.tag}** removido por não verificar em 48h.`);
    }
  }, 48 * 60 * 60 * 1000);
});

client.login(TOKEN);
