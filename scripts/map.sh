if [ $# -lt 1 ]
then
    echo "Usage : $0 -e comingsoon.png -b bridge.png map1.png map2.png ..."
    exit
fi

maps=()

while [ $# -gt 0 ]
do
  case "$1" in
    -b | --bridge)
      map_bridge="$2"
      shift 2
      ;;
    -e | --end)
      map_end=$2
      shift 2
      ;;
    *)
      maps+=($1)
      shift
      ;;
  esac
done

echo -e "\n----------------------"
echo "Maps:" ${maps[@]}
echo "Bridge:" $map_bridge
echo "Coming Soon:" $map_end
echo -e "----------------------\n"

i=0
length=${#maps[@]} 

for map in "${maps[@]}"
do
  i=$((i+1))
  echo "Processing $i $map..."

  ./map_crop.sh -c $map

  if [ $map_bridge ] && [ $length -ne $i ];
  then
    echo "Create bridge between $map and ${maps[$i]}"
    ./map_bridge.sh $map ${maps[$i]} $map_bridge bridge$i.png
    ./map_crop.sh -c bridge$i.png
  fi
  echo -e "\n"
done

if [ $map_end ];
then
  echo "last map" ${maps[-1]}
  ./map_end.sh ${maps[-1]} $map_end comingsoon.png
  ./map_crop.sh -c comingsoon.png
fi
