if [ $# -lt 2 ]
then
    echo "Usage : $0 map.png comingsoon.png (optional)output.png"
    exit
fi

map_height=`identify -format "%[fx:h]" $1`
map_width=`identify -format "%[fx:w]" $1`
overlap_height=`identify -format "%[fx:h]" $2`
overlap_width=`identify -format "%[fx:w]" $2`

crop_start=$(($map_height-$overlap_height))

output=${3:-"output_comingsoon.png"}

convert -append $1 \
        -page +$(($map_width/2-$overlap_width/2))+$crop_start $2 \
        -flatten \
        -crop ${overlap_width}x${overlap_height}+0+${crop_start} \
        +repage \
        ${output}

echo "Output:" $output
