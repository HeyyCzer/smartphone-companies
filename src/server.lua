local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")

src = {}
Tunnel.bindInterface(GetCurrentResourceName(), src)
vCLIENT = Tunnel.getInterface(GetCurrentResourceName())

vRP.Prepare("companyApp/company/getAll", "SELECT * FROM heyy_companies")
vRP.Prepare("companyApp/company/get", "SELECT * FROM heyy_companies WHERE id = @id")
vRP.Prepare("companyApp/announces/get", "SELECT * FROM heyy_companies_announces WHERE companyId = @companyId")
vRP.Prepare("companyApp/announces/new", "INSERT INTO heyy_companies_announces (companyId, authorID, message, image) VALUES (@companyId, @authorID, @message, @image)")
vRP.Prepare("companyApp/announces/delete", "DELETE FROM heyy_companies_announces WHERE id = @id")
vRP.Prepare("companyApp/jobs/get", "SELECT * FROM heyy_companies_jobs")
vRP.Prepare("companyApp/jobs/new", "INSERT INTO heyy_companies_jobs (authorID, description, image) VALUES (@authorID, @description, @image)")
vRP.Prepare("companyApp/company/getLogs", "SELECT * FROM heyy_companies_banklogs WHERE companyId = @companyId")

function src.getCompanies()
	local companies = vRP.Query("companyApp/company/getAll", {})
	return companies
end

function src.getLocation(id)
	local company = vRP.Query("companyApp/company/get", { id = id })
	return json.decode(company.location)
end

-- Company
function src.getCompany(id)
	local user_id = vRP.Passport(source)

	local company = vRP.Query("companyApp/company/get", { id = id })

	local canEdit = vRP.HasGroup(user_id, v.permission)
	return {
		name = company.name,
		type = company.type,
		avatar = company.avatar,
		isOpen = company.isOpen,
		
		canEdit = canEdit,
	}
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
	local jobs = vRP.Query("companyApp/jobs/get", {})
	for k, v in ipairs(jobs) do
		v.author = Internal.getUserName(v.authorID)
	end
	return jobs
end

function src.createJob(description, image)
	local user_id = vRP.Passport(source)

	vRP.Query("companyApp/jobs/new", { authorID = user_id, description = description, image = image })
	notify(-1, "Empresas", "Uma nova vaga de emprego está disponível")

	return { success = true }
end

-- My Company
function src.getMyCompany()
	local user_id = vRP.Passport(source)

	local company = Internal.getUserCompany(user_id)
	if not company then
		return { unauthorized = true }
	end

	local bankLogs = vRP.Query("companyApp/company/getLogs", { companyId = company.id })
	-- author, action, amount, date
	for _, v in ipairs(bankLogs) do
		v.author = Internal.getUserName(v.authorID)
	end

	local workerList = vRP.DataGroup(company.permission)
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
		balance = company.balance, -- TODO: Get data of the right table
		workers = workers,
		bankLogs = bankLogs
	}
end

function Internal.getUserCompany(user_id)
	local results = vRP.Query("companyApp/getCompanies", {})
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
		return { failed = true }
	end
	return exports.tabletshops:withdrawMoney(user_id, company.id, value)
end

function src.depositMoney(value)
	local user_id = vRP.Passport(source)
	local company = Internal.getUserCompany(user_id)
	if not company then
		return { failed = true }
	end
	return exports.tabletshops:depositMoney(user_id, company.id, value)
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
	  	'nui://companies-app/src/nui/index.html'
	)
end)
