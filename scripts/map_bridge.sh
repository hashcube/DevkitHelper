#!/bin/sh

if [ $# -lt 3 ]
then
    echo "Usage : $0 map1.png map2.png bridge.png (optional)output.png"
    exit
fi

map1_height=`identify -format "%[fx:h]" $1`
map1_width=`identify -format "%[fx:w]" $1`
overlap_height=`identify -format "%[fx:h]" $3`
overlap_width=`identify -format "%[fx:w]" $3`
overlap_middle=$((overlap_height/2))

output=${4:-"output.png"}

convert -size ${overlap_width}x${overlap_height} xc:white \
        $2 -geometry +0+0 -composite \
        \( $1 -crop ${overlap_width}x${overlap_middle}+0+$(($map1_height-$overlap_middle)) +repage \) \
            -geometry +0+$overlap_middle -composite \
        $3 -geometry +0+0 -composite \
        ${output}

echo "Output:" $output
