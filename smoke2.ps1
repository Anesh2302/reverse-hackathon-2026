$ErrorActionPreference = 'Continue'
$B = 'https://reverse-hackathon-2026.vercel.app'
$J = "$env:TEMP\rev26jar.txt"
$Phone = '7339614244'
Remove-Item $J -ErrorAction SilentlyContinue

$login = & curl.exe -s -c $J -w '|%{http_code}' -X POST -H 'Content-Type: application/json' --data-binary '{"email":"simonpetercys@gmail.com","password":"RevhackS3cure2026"}' "$B/api/admin/login"
"LOGIN      -> $login"

$timer = & curl.exe -s -b $J -X POST -w '|%{http_code}' "$B/api/admin/timer/REV26-SOLO-9A08CD/start"
"TIMER start-> $timer"

$timerR = & curl.exe -s -b $J -w '|%{http_code}' "$B/api/admin/timer"
"TIMER list -> $(($timerR -split '\|')[1]) running=$($timerR -match 'running')"

$sc = & curl.exe -s -b $J -X PUT -H 'Content-Type: application/json' --data-binary '{"communication":8,"liveShow":9,"domains":7}' -w '|%{http_code}' "$B/api/admin/scores/REV26-SOLO-9A08CD"
"SCORE save -> $sc"

$sR = & curl.exe -s -b $J -w '|%{http_code}' "$B/api/admin/scores"
"SCORE read -> $(($sR -split '\|')[1]) total24=$($sR -match '24')"

$csv = & curl.exe -s -b $J -D - -o "$env:TEMP\rev26.csv" "$B/api/admin/export"
"CSV        -> $(($csv -match 'text/csv') -and (Test-Path "$env:TEMP\rev26.csv")) size=$((Get-Item "$env:TEMP\rev26.csv" -ErrorAction SilentlyContinue).Length)"

$chat = & curl.exe -s -X POST -H 'Content-Type: application/json' --data-binary '{"text":"how do i register?"}' -w '|%{http_code}' "$B/api/chat"
"CHAT post  -> $chat"

$chats = & curl.exe -s -b $J -w '|%{http_code}' "$B/api/admin/chats"
"CHATS admin-> $(($chats -split '\|')[1]) has-question=$($chats -match 'how do i register')"

$html = & curl.exe -s "$B/"
"PHONE in live html -> $($html -match $Phone)"
"HERO one-line nowrap-> $($html -match 'whitespace-nowrap')"
