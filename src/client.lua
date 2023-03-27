local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")

src = {}
Tunnel.bindInterface(GetCurrentResourceName(), src)
vSERVER = Tunnel.getInterface(GetCurrentResourceName())


-- ? Home page
RegisterNUICallback("getCompanies", function(data, callback)
	callback(vSERVER.getCompanies())
end)

RegisterNUICallback("markLocation", function(data, callback)
	local location = vSERVER.getLocation(data.id)
	callback({ success = true })
end)

-- ? Company
RegisterNUICallback("getCompany", function(data, callback)
	callback(vSERVER.getCompany(data.id))
end)

RegisterNUICallback("createAnnounce", function(data, callback)
	callback(vSERVER.createAnnounce(data.companyId, data.message, data.image))
end)

RegisterNUICallback("deleteAnnounce", function(data, callback)
	callback(vSERVER.deleteAnnounce(data.id))
end)

-- ? Jobs
RegisterNUICallback("getJobs", function(data, callback)
	callback(vSERVER.getJobs())
end)

RegisterNUICallback("openWhatsapp", function(data, callback)
	TriggerEvent("smartphone:pusher", "REDIRECT", "/whatsapp/" .. data.phone)
	callback({ success = true })
end)

RegisterNUICallback("createJob", function(data, callback)
	callback(vSERVER.createJob(data.description, data.image))
end)

-- ? My Company
RegisterNUICallback("getMyCompany", function(data, callback)
	callback(vSERVER.getMyCompany())
end)

RegisterNUICallback("withdrawMoney", function(data, callback)
	callback(vSERVER.withdrawMoney(data.value))
end)

RegisterNUICallback("depositMoney", function(data, callback)
	callback(vSERVER.depositMoneyy(data.value))
end)
