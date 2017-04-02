function! g:Deswag() abort range
        " Question mark optionals
        silent! %s/\(\k\+\)\(\s*(.\{-}\),\soptional/\1?\2/
        " Exract types
        silent! %s/\(\s*\k\+?\?\)\s*(\([^)]*\))/\1: \2/
        " Unfold arrays
        silent! %s/Array\[\([^\]]\+\)\]/\1[]/g
        " extract classes
        silent! %s/\(\k\+\)\s\+{\(\_.\{-}\)}/export class \1 {\rconstructor(\2\) { } \r}/
        normal gg=G
endfunction
