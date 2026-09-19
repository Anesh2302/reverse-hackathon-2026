$ErrorActionPreference = 'Stop'
$Base = 'https://reverse-hackathon-2026.vercel.app'
$Email = 'simonpetercys@gmail.com'
$Pass  = 'RevhackS3cure2026'
$Phone = '7339614244'
$Id    = 'REV26-SOLO-9A08CD'

$out = @()
function Call($Path, $Cookie = '', $Method = 'GET', $Body = $null) {
  $uri = "$Base$Path"
  $req = [System.Net.HttpWebRequest]::Create($uri)
  $req.Method = $Method
  $req.ContentType = 'application/json'
  $req.Timeout = 60000
  if ($Cookie) { $req.Headers.Add('Cookie', $Cookie) }
  if ($null -ne $Body) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Body)
    $req.ContentLength = $bytes.Length
    $stream = $req.GetRequestStream()
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
  } else {
    $req.ContentLength = 0
  }
  try {
    $resp = $req.GetResponse()
    $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $text = $sr.ReadToEnd()
    $sr.Close()
    $ck = ''
    foreach ($h in $resp.Headers.GetValues('Set-Cookie')) {
      if ($h -match '^([^=;]+)=([^;]+)') { $ck = "$matches[1]=$matches[2]" }
    }
    return @{ Status = [int]$resp.StatusCode; Body = $text; Cookie = $ck }
  } catch [System.Net.WebException] {
    $r = $_.Exception.Response
    if ($r) { return @{ Status = [int]$r.StatusCode; Body = 'ERR'; Cookie = '' } }
    return @{ Status = 0; Body = $_.Exception.Message; Cookie = '' }
  }
}

# login
$login = Call '/api/admin/login' '' 'POST' ('{"email":"' + $Email + '","password":"' + $Pass + '"}')
$ck = if ($login.Cookie) { $login.Cookie } else { '' }
$out += "LOGIN status=$($login.Status) body=$($login.Body.Substring(0,[Math]::Min(80,$login.Body.Length)))"
$out += "LOGIN cookie-set=$([bool]$ck)"

# timer start
$tm = Call "/api/admin/timer/$Id/start" $ck 'POST' '{}'
$out += "TIMER start status=$($tm.Status) body=$($tm.Body.Substring(0,[Math]::Min(90,$tm.Body.Length)))"

# timer read
$tl = Call '/api/admin/timer' $ck
$out += "TIMER list status=$($tl.Status) running=$($tl.Body -match 'running') startedAt=$($tl.Body -match 'startedAt')"

# score save
$scBody = '{"communication":8,"liveShow":9,"domains":7}'
$sc = Call "/api/admin/scores/$Id" $ck 'PUT' $scBody
$out += "SCORE save status=$($sc.Status) body=$($sc.Body.Substring(0,[Math]::Min(80,$sc.Body.Length)))"

# score read
$sread = Call '/api/admin/scores' $ck
$out += "SCORE total-24-read=$($sread.Body -match '24') status=$($sread.Status)"

# csv export
$csv = Call '/api/admin/export' $ck
$out += "CSV status=$($csv.Status) is-csv=$($csv.Body -match ',') size=$($csv.Body.Length)"

# chat POST (public)
$chat = Call '/api/chat' '' 'POST' '{"text":"how do i register?"}'
$out += "CHAT post status=$($chat.Status) body=$($chat.Body.Substring(0,[Math]::Min(80,$chat.Body.Length)))"

# admin chats
$chats = Call '/api/admin/chats' $ck
$out += "CHATS admin status=$($chats.Status) saved=$($chats.Body -match 'register')"

# phone on homepage
$hp = Call '/' '' 'GET'
$out += "PHONE marker in live index = $($home.Body -match $Phone)"
$out += "ONE-LINE hero marker = $($home.Body -match 'whitespace-nowrap')"

$out | ForEach-Object { Write-Output $_ }
