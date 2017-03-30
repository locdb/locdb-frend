function! g:Deswag() abort
        %s/\(\k\+\)\s{/export class \1 {/
        %s/\(\s*\k\+\)\s(\([^,]\+\),/\1: \2/
        %s/Array\[\([^\]]\+\)\]/[\1]/g
        %s/\(\k\+\):\(.\{-}\)optional),\?/\1?: \2;
        %s/\(\k*\)\s(\([^)]*\))/\1: \2;/
        %s/)/;/
        %s/\s\?;/,/
        %s/{\(\_.\{-}\)}/{\rconstructor(\r\1\r\) { } \r}/
        %s/:\s*\(\S*\),/: \1,/
        normal gg=G
endfunction
