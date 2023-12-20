fx_version "cerulean"
game "gta5"

files {
	"src/nui/**",
}
ui_page "src/nui/index.html"

shared_script {
    "@vrp/lib/Utils.lua",
	"src/shared.lua"
}

client_scripts {
	"src/client.lua"
}

server_scripts {
	"src/server.lua",
}
