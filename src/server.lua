local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")

src = {}
Tunnel.bindInterface(GetCurrentResourceName(), src)
vCLIENT = Tunnel.getInterface(GetCurrentResourceName())

local Internal = {}

vRP.Prepare("companyApp/company/setup", "CREATE TABLE IF NOT EXISTS `heyy_companies` (`id` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',`name` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',`type` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',`avatar` TEXT NOT NULL COLLATE 'latin1_swedish_ci',`permission` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',`balance` INT(11) NOT NULL DEFAULT '0',`location` LONGTEXT NOT NULL COLLATE 'utf8mb4_bin',`isOpen` TINYINT(4) NOT NULL DEFAULT '0',PRIMARY KEY (`id`) USING BTREE,CONSTRAINT `location` CHECK (json_valid(`location`)))")
vRP.Prepare("companyApp/announces/setup", "CREATE TABLE IF NOT EXISTS `heyy_companies_announces` (`id` INT(11) NOT NULL AUTO_INCREMENT,`companyId` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',`authorID` INT(11) NOT NULL,`message` TEXT NOT NULL COLLATE 'latin1_swedish_ci',`image` TEXT NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',`createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp(),PRIMARY KEY (`id`) USING BTREE)")
vRP.Prepare("companyApp/jobs/setup", "CREATE TABLE IF NOT EXISTS `heyy_companies_jobs` (`id` INT(11) NOT NULL AUTO_INCREMENT,`authorID` INT(11) NOT NULL,`description` TEXT NOT NULL COLLATE 'latin1_swedish_ci',`image` TEXT NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',`createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp(),PRIMARY KEY (`id`) USING BTREE)")
vRP.Prepare("companyApp/bank/setup", "CREATE TABLE IF NOT EXISTS `heyy_companies_banklogs` (`id` INT(11) NOT NULL AUTO_INCREMENT,`companyId` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',`authorID` INT(11) NOT NULL,`action` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',`amount` INT(11) NOT NULL,`date` TIMESTAMP NOT NULL DEFAULT current_timestamp(),PRIMARY KEY (`id`) USING BTREE)")

vRP.Prepare("companyApp/company/getAll", "SELECT * FROM heyy_companies")
vRP.Prepare("companyApp/company/getOpen", "SELECT * FROM heyy_companies WHERE isOpen = 1")
vRP.Prepare("companyApp/company/get", "SELECT * FROM heyy_companies WHERE id = @id")
vRP.Prepare("companyApp/company/toggle", "UPDATE heyy_companies SET isOpen = NOT isOpen WHERE id = @id")
vRP.Prepare("companyApp/announces/get", "SELECT * FROM heyy_companies_announces WHERE companyId = @companyId ORDER BY createdAt DESC")
vRP.Prepare("companyApp/announces/new", "INSERT INTO heyy_companies_announces (companyId, authorID, message, image) VALUES (@companyId, @authorID, @message, @image)")
vRP.Prepare("companyApp/announces/delete", "DELETE FROM heyy_companies_announces WHERE id = @id")
vRP.Prepare("companyApp/jobs/get", "SELECT * FROM heyy_companies_jobs WHERE createdAt >= DATE(NOW() - INTERVAL 2 DAY) ORDER BY createdAt DESC")
vRP.Prepare("companyApp/jobs/contains", "SELECT * FROM heyy_companies_jobs WHERE authorID = @authorID AND createdAt >= DATE(NOW() - INTERVAL 2 DAY)")
vRP.Prepare("companyApp/jobs/new", "INSERT INTO heyy_companies_jobs (authorID, description, image) VALUES (@authorID, @description, @image)")
vRP.Prepare("companyApp/jobs/delete", "DELETE FROM heyy_companies_jobs WHERE id = @id")
vRP.Prepare("companyApp/bank/getLogs", "SELECT * FROM heyy_companies_banklogs WHERE companyId = @companyId ORDER BY date DESC LIMIT 25")
vRP.Prepare("companyApp/bank/newLog", "INSERT INTO heyy_companies_banklogs (companyId, authorID, action, amount) VALUES (@companyId, @authorID, @action, @amount)")

Citizen.CreateThread(function()
	Wait(1000)

	vRP.Query("companyApp/company/setup")
	vRP.Query("companyApp/announces/setup")
	vRP.Query("companyApp/jobs/setup")
	vRP.Query("companyApp/bank/setup")

	-- Fechar lojas sozinhas se ninguém estiver trabalhando
	while true do
		Wait(60 * 1000) -- 60s
		local results = vRP.Query("companyApp/company/getOpen", {}) or {}
		for k, v in ipairs(results) do
			local Users, Total = vRP.NumPermission(v.permission)
			if Total <= 0 then
				_warning("^3" .. v.name .. " ^0foi fechado(a) automaticamente por não ter ninguém trabalhando")
				src.toggleStatus(v.id)
			end
		end
	end
end)

function src.getCompanies()
	local companies = vRP.Query("companyApp/company/getAll", {})
	return companies
end

function src.getLocation(id)
	local company = vRP.Query("companyApp/company/get", { id = id })[1]
	return json.decode(company.location)
end

-- Company
function src.getCompany(id)
	local user_id = vRP.Passport(source)

	local company = vRP.Query("companyApp/company/get", { id = id })[1]
	local announces = vRP.Query("companyApp/announces/get", { companyId = id })
	for k, v in ipairs(announces) do
		v.author = Internal.getUserName(v.authorID)
	end

	local canEdit = vRP.HasGroup(user_id, company.permission)
	return {
		company = {
			name = company.name,
			type = company.type,
			avatar = company.avatar,
			isOpen = company.isOpen,
			
			canEdit = canEdit,
		},
		announces = announces
	}
end

function src.toggleStatus(id)
	vRP.Query("companyApp/company/toggle", { id = id })

	local company = vRP.Query("companyApp/company/get", { id = id })[1]
	notify(-1, company.name, (company.isOpen == 1 and "Acabamos de abrir, venha nos visitar!" or "Encerramos nossas atividades por agora, voltamos em breve"))

	return { success = true }
end

function src.createAnnounce(companyId, message, image)
	local user_id = vRP.Passport(source)
	vRP.Query("companyApp/announces/new", { companyId = companyId, authorID = user_id, message = message, image = image })

	return { success = true }
end

function src.deleteAnnounce(id)
	vRP.Query("companyApp/announces/delete", { id = id })

	return { success = true }
end

-- Jobs
function src.getJobs()
	local user_id = vRP.Passport(source)
	
	local jobs = vRP.Query("companyApp/jobs/get", {})
	for k, v in ipairs(jobs) do
		local identity = vRP.Identity(v.authorID)

		v.author = identity.name .. " " .. identity.name2
		v.phone = identity.phone
		v.isAuthor = (user_id == v.authorID)
		v.isAdmin = vRP.HasGroup(user_id, "Admin", 1)
	end
	return jobs
end

function src.createJob(description, image)
	local user_id = vRP.Passport(source)

	local results = vRP.Query("companyApp/jobs/contains", { authorID = user_id })
	if #results <= 0 then
		vRP.Query("companyApp/jobs/new", { authorID = user_id, description = description, image = image })
		notify(-1, "Empresas", "Uma nova vaga de emprego está disponível")
		return { success = true }
	end
	return { failed = "Você já possui uma <span class=\"text-primary\">vaga de emprego</span> anunciada! Exclua-a ou aguarde sua data de expiração para publicar outra." }
end

function src.deleteJob(id)
	vRP.Query("companyApp/jobs/delete", { id = id })
	return { success = true }
end

-- My Company
function src.getMyCompany()
	local user_id = vRP.Passport(source)

	local company = Internal.getUserCompany(user_id)
	if not company then
		return { unauthorized = true }
	end

	local bankLogs = vRP.Query("companyApp/bank/getLogs", { companyId = company.id })
	-- author, action, amount, date
	for _, v in ipairs(bankLogs) do
		v.author = Internal.getUserName(v.authorID)
	end

	local workerList = vRP.DataGroups(company.permission)
	local workers = {}
	-- id, name, status
	for pID, hierarchy in pairs(workerList) do
		pID = parseInt(pID)

		local status = "offline"
		if vRP.Source(pID) then -- is online
			status = "online"
			if vRP.HasService(pID, company.permission) then
				status = "working"
			end
		end

		table.insert(workers, {
			id = pID,
			name = Internal.getUserName(pID),
			status = status
		})
	end

	table.sort(workers, function(a, b)
		return a.id < b.id
	end)

	return {
		balance = exports.tabletshops:getBalance(company.permission),
		workers = workers,
		bankLogs = bankLogs
	}
end

function Internal.getUserCompany(user_id)
	local results = vRP.Query("companyApp/company/getAll", {})
	for k, v in ipairs(results) do
		if vRP.HasGroup(user_id, v.permission, 1) then
			return v
		end
	end
	return nil
end

function src.withdrawMoney(value)
	local user_id = vRP.Passport(source)
	local company = Internal.getUserCompany(user_id)
	if not company then
		return false
	end

	if exports.tabletshops:withdraw(user_id, company.permission, value) then
		vRP.Query("companyApp/bank/newLog", { companyId = company.id, authorID = user_id, action = "withdraw", amount = value })

		local name = Internal.getUserName(user_id)
		for nuser_id, player in pairs(vRP.NumPermission(company.permission)) do
			if vRP.HasGroup(nuser_id, company.permission, 1) then
				notify(player, company.name .. " - Financeiro", "<b>" .. name .. "</b> sacou <b>$" .. value .. "</b>")
			end
		end
		return { success = true }
	end
	return false
end

function src.depositMoney(value)
	local user_id = vRP.Passport(source)
	local company = Internal.getUserCompany(user_id)
	if not company then
		return false
	end

	if exports.tabletshops:deposit(user_id, company.permission, value) then
		vRP.Query("companyApp/bank/newLog", { companyId = company.id, authorID = user_id, action = "deposit", amount = value })
		
		local name = Internal.getUserName(user_id)
		for nuser_id, player in pairs(vRP.NumPermission(company.permission)) do
			if vRP.HasGroup(nuser_id, company.permission, 1) then
				notify(player, company.name .. " - Financeiro", "<b>" .. name .. "</b> depositou <b>$" .. value .. "</b>")
			end
		end
		return true
	end
	return false
end

-- Utils
function Internal.getUserName(user_id)
	local identity = vRP.Identity(user_id)
	return identity.name .. " " .. identity.name2
end

function notify(target, title, subtitle)
	TriggerClientEvent("smartphone:pusher", target, "CUSTOM_NOTIFY", {
		app = "companies",
		title = title,
		subtitle = subtitle
	})
end

AddEventHandler('smartphone:isReady', function()
	exports.smartphone:createApp(
	  	'companies', 
	  	'Empresas', 
	  	'https://cdn.discordapp.com/attachments/959206573350203462/1088146811887304804/image.png',
	  	'nui://' .. GetCurrentResourceName() .. '/src/nui/index.html'
	)
end)
