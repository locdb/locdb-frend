function! g:Deswag() abort range
	" Translate Swagger model pseudo-code into proper Typescript
	
        " Question mark optionals
        silent! %s/\(\i\+\)\(\s*(.\{-}\),\soptional/\1?\2/
        " Exract types
        silent! %s/\(\s*\i\+?\?\)\s*(\([^)]*\)),\?/\1: \2;/
        " Unfold arrays
        silent! %s/Array\[\([^\]]\+\)\]/\1[]/g
        " extract classes 
        " silent! %s/\(\i\+\)\s\+{\(\_.\{-}\)}/export class \1 {\rconstructor(\2\) { } \r}/
        silent! %s/^\(\i\+\)\s\+\({\_.\{-}}\)/export class \1 \2/
        normal gg=G
endfunction
