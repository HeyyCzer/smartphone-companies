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

	TriggerEvent("Notify", "sucesso", "Localização marcada em seu GPS")
	SetNewWaypoint(location[1], location[2])

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

RegisterNUICallback("toggleStatus", function(data, callback)
	callback(vSERVER.toggleStatus(data.id))
end)

-- ? Jobs
RegisterNUICallback("getJobs", function(data, callback)
	callback(vSERVER.getJobs())
end)

RegisterNUICallback("openWhatsapp", function(data, callback)
	exports["lb-phone"]:SetContactModal(data.phone)
	callback({ success = true })
end)

RegisterNUICallback("createJob", function(data, callback)
	callback(vSERVER.createJob(data.description, data.image))
end)

RegisterNUICallback("deleteJob", function(data, callback)
	callback(vSERVER.deleteJob(data.id))
end)

-- ? My Company
RegisterNUICallback("getMyCompany", function(data, callback)
	callback(vSERVER.getMyCompany())
end)

RegisterNUICallback("withdrawMoney", function(data, callback)
	callback(vSERVER.withdrawMoney(tonumber(data.value)))
end)

RegisterNUICallback("depositMoney", function(data, callback)
	callback(vSERVER.depositMoney(tonumber(data.value)))
end)

Citizen.CreateThread(function()
	local added, errorMessage = exports["lb-phone"]:AddCustomApp({
		identifier = "companies-app",
		name = "Empresas",
		description = "Entre em contato e gerencie sua empresa",
        ui = GetCurrentResourceName() .. "/src/nui/index.html", -- this is the path to the HTML file,
		developer = "HeyyCzer",
		defaultApp = true,
		size = 59812,
		icon = "https://cdn.discordapp.com/attachments/959206573350203462/1088146811887304804/image.png", -- OPTIONAL app icon
    })

    if not added then
        print("Erro ao adicionar aplicativo:", errorMessage)
    end
end)