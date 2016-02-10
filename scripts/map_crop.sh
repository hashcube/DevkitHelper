#!/bin/sh

function check_compress () {
  while getopts ":cn" opt; do
    case $opt in
      c)
        return 1
        ;;
      n)
        return 0
        ;;
      \?)
        echo "Invalid option: -$OPTARG" >&2
        exit 1
        ;;
    esac
  done

  echo "-n or -c required" >&2
  exit 1
}


if [ $# -lt 2 ]
then
  echo "Usage : $0 -c map.png"
  echo ""
  echo "-n or -c is necessory."
  echo "  -c pngquant images"
  echo "  -n don't pngquant images"
  exit
fi

check_compress "$@"
compress=$?

# remove compress option from arguments
shift

# get folder name
folder="${1%.*}"
echo "Creating folder" $folder
mkdir -p $folder

echo "Creating tiles..."
convert $1 -crop 64x100 \
           -set filename:tile "%[fx:page.y/100]_%[fx:page.x/64]" \
           +repage +adjoin "$folder/%[filename:tile].png"

if [ $compress -ne 0 ];
then
    echo "Compressing images..."
    find $folder -name '*.png' -exec pngquant --ext .png --force {} \;
fi

echo "Done!"
