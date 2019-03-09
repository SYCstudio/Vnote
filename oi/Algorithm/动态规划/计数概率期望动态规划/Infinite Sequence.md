# Infinite Sequence
[ARC071F]

有$n$多少个无限长的由${1,2...,n}$组成的序列$a1,a2...$满足以下条件:  
1.第$n$个及以后的元素是相同的，即若$n≤i,j,ai=aj$。  
2.对于每个位置$i$，紧随第$i$个元素后的$ai$个元素是相同的，即若$i&lt;j&lt;k≤i+ai,aj=ak$。  
输入n,请输出序列数量 $mod$ $1000000007$

注意到有一个不错的性质，如果当前位填非 1， 后一位如果也填非 1 ，那么再往后的就确定了，否则，接下来要填多少个 1 是确定的。那么设 F[i] 表示填到第 i 位且第 i 位为一个可以自由填写的数，那么有两种转移，一是直接填 1 ，从 F[i-1] 转移过来，二是填一个大于 1 的数，即从 F[i-3]...F[i-n-1] 转移过来。注意到这里填的数有可能超过 n ，所以第二种转移需要转移到 2n 。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

const int maxN=1000100<<1;
const int Mod=1e9+7;

int n;
int F[maxN],G[maxN];

int main(){
    scanf("%d",&n);
    F[0]=G[0]=1;
    for (int i=1;i<=n+n;i++){
        int l=max(0,i-n-1),r=min(n-1,i-3);
        if (l<=r) F[i]=(((F[i]+G[r]-(l?G[l-1]:0))%Mod)+Mod)%Mod;
        if (i<=n) F[i]=(F[i]+F[i-1])%Mod;
        G[i]=(G[i-1]+F[i])%Mod;
    }
    int Ans=(G[n+n]-G[n-1]+Mod)%Mod;
    for (int i=0;i+2<=n;i++){
        if (i+2<=n) Ans=(Ans+1ll*F[i]*(n-1)%Mod*(n-1)%Mod)%Mod;
    }
    printf("%d\n",Ans);return 0;
}
```