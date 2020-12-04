# Check for version alignment between RN and Android SDK
rn_version=$(awk '/"version"/ {print $2;exit}' package.json | tr -d '",')
android_version=$(awk -F'"' '/android:value/ {print $2}' android/src/main/AndroidManifest.xml)

if [ "${rn_version}" != "$android_version" ]; then
  echo "Commit failed SDK version mismatch"
  echo "Please ensure package.json and android/src/main/AndroidManifest.xml have the same version"
  exit -1
fi
