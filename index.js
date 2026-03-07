const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// ─── SERVER STRUCTURE ────────────────────────────────────────────────────────

const ROLES = [
  // BOTS
  { name: 'TTS Bot',        color: '#95a5a6', hoist: false, position: 0 },
  { name: 'Ticket Tool',    color: '#95a5a6', hoist: false, position: 0 },

  // FUN
  { name: 'active',         color: '#f1c40f', hoist: false, position: 0 },
  { name: 'Server Booster', color: '#f47fff', hoist: false, position: 0 },
  { name: 'decorator',      color: '#9b59b6', hoist: false, position: 0 },
  { name: 'Chaos Agent',    color: '#e67e22', hoist: false, position: 0 },
  { name: 'Twisted Bait',   color: '#e74c3c', hoist: false, position: 0 },
  { name: 'Floor Legend',   color: '#f39c12', hoist: false, position: 0 },

  // TOON ROLES
  { name: '🐱 little mime',        color: '#bdc3c7', hoist: false, position: 0 },
  { name: '🌿 sprout',             color: '#2ecc71', hoist: false, position: 0 },
  { name: '🐚 shelly',             color: '#1abc9c', hoist: false, position: 0 },
  { name: '📺 broken tv',          color: '#7f8c8d', hoist: false, position: 0 },
  { name: '🎈 astro',              color: '#3498db', hoist: false, position: 0 },
  { name: '🧸 goob',               color: '#9b59b6', hoist: false, position: 0 },
  { name: '🐱 cosmo',              color: '#e91e63', hoist: false, position: 0 },
  { name: '🌸 bobette',            color: '#ff69b4', hoist: false, position: 0 },
  { name: '🐶 vee',                color: '#e74c3c', hoist: false, position: 0 },
  { name: '🎀 fly',                color: '#e91e63', hoist: false, position: 0 },

  // FLOOR BADGES
  { name: '🪨 Floor Crawler',   color: '#7f8c8d', hoist: false, position: 0 },
  { name: '🌿 Deep Runner',     color: '#2ecc71', hoist: false, position: 0 },
  { name: '❄️ Floor Veteran',   color: '#3498db', hoist: false, position: 0 },
  { name: '⚡ Elite Delver',    color: '#f39c12', hoist: false, position: 0 },
  { name: '💀 Abyss Walker',    color: '#e74c3c', hoist: false, position: 0 },

  // GAMEPLAY
  { name: '🎯 Distractor',   color: '#e74c3c', hoist: true, position: 0 },
  { name: '🔧 Extractor',    color: '#3498db', hoist: true, position: 0 },
  { name: '💊 Support',      color: '#9b59b6', hoist: true, position: 0 },
  { name: '🗡️ Frontliner',   color: '#e67e22', hoist: true, position: 0 },
  { name: '👁️ Recon',        color: '#1abc9c', hoist: true, position: 0 },
  { name: '🛡️ Protector',    color: '#f39c12', hoist: true, position: 0 },

  // VERIFIED
  { name: '✅ Verified Runner', color: '#2ecc71', hoist: true, position: 0 },

  // STAFF
  { name: '📋 Run Leader',  color: '#f39c12', hoist: true, position: 0 },
  { name: '🛡️ Warden',      color: '#e74c3c', hoist: true, permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ViewAuditLog, PermissionFlagsBits.ManageRoles], position: 0 },
  { name: '🤝 Co-Owner',    color: '#9b59b6', hoist: true, permissions: [PermissionFlagsBits.Administrator], position: 0 },
  { name: '👑 Owner',       color: '#f1c40f', hoist: true, permissions: [PermissionFlagsBits.Administrator], position: 0 },
];

const CATEGORIES = [
  {
    name: '📢 INFO',
    channels: [
      { name: '📣announcements',        type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
      { name: '📋update-log',           type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
      { name: '⭐twisted-board',        type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
      { name: '❓guessing-the-new-toon',type: ChannelType.GuildText, verifiedOnly: false, readOnly: false },
      { name: '🎥hf-proof-vid',         type: ChannelType.GuildText, verifiedOnly: false, readOnly: false },
    ]
  },
  {
    name: '🔒 VERIFICATION',
    channels: [
      { name: '🚪waiting-room',         type: ChannelType.GuildText, verifiedOnly: false, readOnly: true, isWaiting: true },
      { name: '📷floor-verification',   type: ChannelType.GuildText, verifiedOnly: false, readOnly: false, isVerification: true },
    ]
  },
  {
    name: '🏃 RUNS',
    channels: [
      { name: '🎪random-runs',          type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '💎run-results',          type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '🔗link-ps',              type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '📅run-scheduling',       type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '👥looking-for-group',    type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
    ]
  },
  {
    name: '📖 GUIDES',
    channels: [
      { name: '🐱toon-guide',           type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
      { name: '🎯distractor-guide',     type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
      { name: '🧁healer-guide',         type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
      { name: '🔧extractor-guide',      type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
      { name: '📝support-guide',        type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
      { name: '🗡️frontliner-guide',     type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
    ]
  },
  {
    name: '💬 CONVÍVIO',
    channels: [
      { name: '💬general',              type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '🔮randoms',              type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '😂memes',                type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '🎨fan-art',              type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '🖼️screenshots',          type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '🎵music-vibes',          type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '📸media',                type: ChannelType.GuildText, verifiedOnly: true, readOnly: false },
      { name: '📓guide-for-our-server', type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
      { name: '💡suggestions',          type: ChannelType.GuildForum, verifiedOnly: true, readOnly: false },
    ]
  },
  {
    name: '📜 RULES',
    channels: [
      { name: '📜rules',                type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
      { name: '☕chat-rules',           type: ChannelType.GuildText, verifiedOnly: false, readOnly: true },
    ]
  },
  {
    name: '🔊 VOICE',
    channels: [
      { name: '🏠 lobby',              type: ChannelType.GuildVoice, verifiedOnly: true },
      { name: '🏃 run room 1',         type: ChannelType.GuildVoice, verifiedOnly: true },
      { name: '🏃 run room 2',         type: ChannelType.GuildVoice, verifiedOnly: true },
      { name: '📝 strategy planning',  type: ChannelType.GuildVoice, verifiedOnly: true },
      { name: '🎨 chill & draw',       type: ChannelType.GuildVoice, verifiedOnly: true },
      { name: '🎵 music vc',           type: ChannelType.GuildVoice, verifiedOnly: true },
      { name: '🎙️ afk',                type: ChannelType.GuildVoice, verifiedOnly: false },
    ]
  },
  {
    name: '🛡️ STAFF ONLY',
    staffOnly: true,
    channels: [
      { name: '🛡️mod-chat',            type: ChannelType.GuildText, staffOnly: true },
      { name: '📋verification-log',     type: ChannelType.GuildText, staffOnly: true },
      { name: '⚠️mod-actions',          type: ChannelType.GuildText, staffOnly: true },
    ]
  },
];

// ─── SETUP COMMAND ────────────────────────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content !== '!setup') return;
  if (message.author.id !== config.ownerId) return message.reply('❌ Só o owner pode correr este comando.');

  const guild = message.guild;
  await message.reply('⚙️ A montar o servidor... isto pode demorar uns segundos.');

  try {
    // 1. DELETE all existing channels and roles (except @everyone and bot role)
    await message.channel.send('🧹 A limpar canais existentes...');
    const existingChannels = await guild.channels.fetch();
    for (const [, ch] of existingChannels) {
      await ch.delete().catch(() => {});
    }

    await message.channel.send('🧹 A limpar roles existentes...');
    const existingRoles = await guild.roles.fetch();
    for (const [, role] of existingRoles) {
      if (role.name !== '@everyone' && !role.managed) {
        await role.delete().catch(() => {});
      }
    }

    // 2. CREATE ROLES
    await message.channel.send('🎭 A criar roles...');
    const createdRoles = {};
    for (const roleData of ROLES) {
      const role = await guild.roles.create({
        name: roleData.name,
        color: roleData.color || '#99aab5',
        hoist: roleData.hoist || false,
        permissions: roleData.permissions || [],
        mentionable: false,
      });
      createdRoles[roleData.name] = role;
    }

    const verifiedRole = createdRoles['✅ Verified Runner'];
    const wardenRole = createdRoles['🛡️ Warden'];
    const ownerRole = createdRoles['👑 Owner'];
    const everyoneRole = guild.roles.everyone;

    // 3. CREATE CATEGORIES AND CHANNELS
    await message.channel.send('📁 A criar canais e categorias...');
    for (const cat of CATEGORIES) {
      // Build category permissions
      let catPermissions = [];

      if (cat.staffOnly) {
        catPermissions = [
          { id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] },
          { id: wardenRole.id,   allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          { id: ownerRole.id,    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        ];
      } else {
        catPermissions = [
          { id: everyoneRole.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
        ];
      }

      const category = await guild.channels.create({
        name: cat.name,
        type: ChannelType.GuildCategory,
        permissionOverwrites: catPermissions,
      });

      for (const ch of cat.channels) {
        let permOverwrites = [];

        if (cat.staffOnly || ch.staffOnly) {
          permOverwrites = [
            { id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: wardenRole.id,   allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: ownerRole.id,    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          ];
        } else if (ch.isWaiting) {
          // Waiting room: everyone can see, nobody can type
          permOverwrites = [
            { id: everyoneRole.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
          ];
        } else if (ch.isVerification) {
          // Verification: unverified can post, verified cannot (they're already in)
          permOverwrites = [
            { id: everyoneRole.id,  allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: verifiedRole.id,  deny: [PermissionFlagsBits.ViewChannel] },
          ];
        } else if (ch.verifiedOnly) {
          // Verified members only
          permOverwrites = [
            { id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: verifiedRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: wardenRole.id,   allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: ownerRole.id,    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          ];
        } else if (ch.readOnly) {
          // Everyone can see, only staff can post
          permOverwrites = [
            { id: everyoneRole.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
            { id: wardenRole.id,   allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: ownerRole.id,    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          ];
        } else {
          // Public read + write
          permOverwrites = [
            { id: everyoneRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          ];
        }

        if (ch.type === ChannelType.GuildForum) {
          await guild.channels.create({
            name: ch.name,
            type: ChannelType.GuildForum,
            parent: category.id,
            permissionOverwrites: permOverwrites,
          }).catch(() => {});
        } else {
          await guild.channels.create({
            name: ch.name,
            type: ch.type,
            parent: category.id,
            permissionOverwrites: permOverwrites,
          }).catch(() => {});
        }
      }
    }

    // 4. ASSIGN OWNER ROLE TO THE COMMAND AUTHOR
    const ownerMember = await guild.members.fetch(message.author.id);
    await ownerMember.roles.add(ownerRole).catch(() => {});

    await message.channel.send(
      '✅ **Servidor montado com sucesso!**\n\n' +
      '**Próximos passos:**\n' +
      '1. Vai a **Server Settings → Roles** e arrasta as roles pela ordem certa\n' +
      '2. Usa `!verify @user <floor>` para verificar membros\n' +
      '3. Usa `!role <nome>` para auto-atribuir roles de gameplay\n' +
      '4. Usa `!rolemenu` em #guide-for-our-server para postar o menu de roles\n\n' +
      '`!help` para ver todos os comandos.'
    );

  } catch (err) {
    console.error(err);
    message.channel.send('❌ Ocorreu um erro: ' + err.message);
  }
});

// ─── VERIFY COMMAND ───────────────────────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const guild = message.guild;

  const getRole = (name) => guild.roles.cache.find(r => r.name === name);
  const hasRole = (member, name) => member.roles.cache.some(r => r.name === name);
  const isStaff = (member) => hasRole(member, '🛡️ Warden') || hasRole(member, '👑 Owner') || hasRole(member, '🤝 Co-Owner');

  // !verify @user <floor>
  if (command === 'verify') {
    if (!isStaff(message.member)) return message.reply('❌ Só Wardens podem verificar membros.');
    const target = message.mentions.members.first();
    const floor = parseInt(args[1]);
    if (!target || isNaN(floor)) return message.reply('Uso: `!verify @user <floor>`');

    const verifiedRole = getRole('✅ Verified Runner');
    if (verifiedRole) await target.roles.add(verifiedRole).catch(console.error);

    // Floor badge
    let badge = null;
    if (floor >= 40) badge = getRole('💀 Abyss Walker');
    else if (floor >= 30) badge = getRole('⚡ Elite Delver');
    else if (floor >= 20) badge = getRole('❄️ Floor Veteran');
    else if (floor >= 10) badge = getRole('🌿 Deep Runner');
    else badge = getRole('🪨 Floor Crawler');
    if (badge) await target.roles.add(badge).catch(console.error);

    const log = guild.channels.cache.find(c => c.name === '📋verification-log');
    if (log) log.send(`✅ **${target.user.tag}** verificado no Floor **${floor}** por ${message.author.tag}`);

    const general = guild.channels.cache.find(c => c.name === '💬general');
    if (general) general.send(`✅ **${target.user.username}** entrou na crew — Floor **${floor}**. Bem-vindo! 🎯`);

    return message.reply(`✅ ${target.user.username} verificado no Floor ${floor}!`);
  }

  // !role <nome>
  if (command === 'role') {
    if (!hasRole(message.member, '✅ Verified Runner')) return message.reply('❌ Precisas de ser verificado primeiro.');

    const selfAssignRoles = [
      '🎯 Distractor', '🔧 Extractor', '💊 Support', '🗡️ Frontliner', '👁️ Recon', '🛡️ Protector',
      '🐱 little mime', '🌿 sprout', '🐚 shelly', '📺 broken tv', '🎈 astro',
      '🧸 goob', '🐱 cosmo', '🌸 bobette', '🐶 vee', '🎀 fly',
      '🏆 Floor Legend', '🎲 Chaos Agent', '💀 Twisted Bait', '⚡ active', '🎨 decorator',
    ];

    const input = args.join(' ').toLowerCase();
    const found = selfAssignRoles.find(r => r.toLowerCase().includes(input));
    if (!found) return message.reply(`❌ Role não encontrada. Usa \`!rolemenu\` para ver as disponíveis.`);

    const role = getRole(found);
    if (!role) return message.reply('❌ Role não existe no servidor ainda.');

    if (message.member.roles.cache.has(role.id)) {
      await message.member.roles.remove(role);
      return message.reply(`🔄 Role **${found}** removida.`);
    } else {
      await message.member.roles.add(role);
      return message.reply(`✅ Agora tens a role **${found}**!`);
    }
  }

  // !rolemenu
  if (command === 'rolemenu') {
    if (!isStaff(message.member)) return message.reply('❌ Só staff pode postar o menu.');
    const embed = `
🎮 **ESCOLHE A TUA ROLE DE GAMEPLAY**
\`!role distractor\` — 🎯 Distractor
\`!role extractor\` — 🔧 Extractor
\`!role support\` — 💊 Support
\`!role frontliner\` — 🗡️ Frontliner
\`!role recon\` — 👁️ Recon
\`!role protector\` — 🛡️ Protector

🐾 **ESCOLHE O TEU TOON FAVORITO**
\`!role little mime\` — 🐱 Little Mime
\`!role sprout\` — 🌿 Sprout
\`!role shelly\` — 🐚 Shelly
\`!role broken tv\` — 📺 Broken TV
\`!role astro\` — 🎈 Astro
\`!role goob\` — 🧸 Goob
\`!role cosmo\` — 🐱 Cosmo
\`!role bobette\` — 🌸 Bobette
\`!role vee\` — 🐶 Vee
\`!role fly\` — 🎀 Fly

😂 **ROLES DE PERSONALIDADE**
\`!role floor legend\` — 🏆 Floor Legend
\`!role chaos agent\` — 🎲 Chaos Agent
\`!role twisted bait\` — 💀 Twisted Bait
\`!role active\` — ⚡ Active
\`!role decorator\` — 🎨 Decorator
    `;
    return message.channel.send(embed);
  }

  // !runresult <floor> @users
  if (command === 'runresult') {
    if (!hasRole(message.member, '✅ Verified Runner')) return message.reply('❌ Verificados apenas.');
    const floor = args[0];
    const team = message.mentions.members.map(m => m.user.username).join(', ');
    if (!floor || !team) return message.reply('Uso: `!runresult <floor> @user1 @user2`');

    const resultsChannel = guild.channels.cache.find(c => c.name === '💎run-results');
    if (!resultsChannel) return message.reply('❌ Canal de resultados não encontrado.');

    resultsChannel.send(
      `🏆 **Run Result — Floor ${floor}**\n` +
      `👥 Equipa: ${team}\n` +
      `📅 ${new Date().toLocaleDateString('pt-PT')}\n` +
      `Posted by: ${message.author.username}`
    );
    return message.reply(`✅ Resultado postado em run-results!`);
  }

  // !kick / !ban
  if (command === 'kick') {
    if (!isStaff(message.member)) return message.reply('❌ Só Wardens.');
    const target = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'Sem razão';
    if (!target) return message.reply('Uso: `!kick @user <razão>`');
    await target.kick(reason);
    const log = guild.channels.cache.find(c => c.name === '⚠️mod-actions');
    if (log) log.send(`👢 **${target.user.tag}** kickado por **${message.author.tag}** — ${reason}`);
    return message.reply(`👢 ${target.user.username} foi kickado.`);
  }

  if (command === 'ban') {
    if (!isStaff(message.member)) return message.reply('❌ Só Wardens.');
    const target = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'Sem razão';
    if (!target) return message.reply('Uso: `!ban @user <razão>`');
    await target.ban({ reason });
    const log = guild.channels.cache.find(c => c.name === '⚠️mod-actions');
    if (log) log.send(`🔨 **${target.user.tag}** banido por **${message.author.tag}** — ${reason}`);
    return message.reply(`🔨 ${target.user.username} foi banido.`);
  }

  // !help
  if (command === 'help') {
    return message.reply(
      '**🎮 Comandos do Bot**\n\n' +
      '`!setup` — Monta o servidor inteiro *(owner only)*\n' +
      '`!verify @user <floor>` — Verifica um membro *(warden only)*\n' +
      '`!rolemenu` — Posta o menu de roles *(warden only)*\n' +
      '`!role <nome>` — Auto-atribui uma role\n' +
      '`!runresult <floor> @users` — Posta resultado de run\n' +
      '`!kick @user <razão>` — Kicka membro *(warden only)*\n' +
      '`!ban @user <razão>` — Bane membro *(warden only)*\n'
    );
  }
});

// ─── AUTO WELCOME ─────────────────────────────────────────────────────────────
client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.channels.cache.find(c => c.name === '🚪waiting-room');
  if (!channel) return;

  channel.send(
    `👁️ **${member.user.username}** chegou.\n\n` +
    `Este servidor é para jogadores sérios de Dandy's World.\n` +
    `Vai a <#${member.guild.channels.cache.find(c => c.name === '📷floor-verification')?.id}> e posta o teu floor mais alto para entrares.\n\n` +
    `*Tens 48 horas. Não verificares = saíres automaticamente.*`
  );

  // Auto-kick after 48h if not verified
  setTimeout(async () => {
    const fresh = await member.guild.members.fetch(member.id).catch(() => null);
    if (!fresh) return;
    const verified = fresh.roles.cache.some(r => r.name === '✅ Verified Runner');
    if (!verified) {
      await fresh.kick('Não verificou em 48 horas').catch(console.error);
      const log = member.guild.channels.cache.find(c => c.name === '📋verification-log');
      if (log) log.send(`🚪 **${member.user.tag}** foi removido automaticamente por não verificar em 48h.`);
    }
  }, 48 * 60 * 60 * 1000);
});

client.once('ready', () => {
  console.log(`✅ Dandy's World Bot online como ${client.user.tag}`);
});

client.login(config.token);
