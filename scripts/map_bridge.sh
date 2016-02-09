if [ $# -lt 3 ]
then
    echo "Usage : $0 map1.png map2.png bridge.png (optional)output.png"
    exit
fi

map_height=`identify -format "%[fx:h]" $1`
map_width=`identify -format "%[fx:w]" $1`
overlap_height=`identify -format "%[fx:h]" $3`
overlap_width=`identify -format "%[fx:w]" $3`

crop_start=$(($map_height-$overlap_height/2))

output=${4:-"output.png"}

convert -append $1 $2 \
        -page +$(($map_width/2-$overlap_width/2))+$crop_start $3 \
        -flatten \
        -crop ${overlap_width}x${overlap_height}+0+${crop_start} \
        ${output}

echo "Output:" $output
