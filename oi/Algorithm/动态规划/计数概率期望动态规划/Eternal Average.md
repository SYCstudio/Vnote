# Eternal Average
[AGC009F]

黑板上有$n$个0和$m$个1，我们每次选择$k$个数字将其擦除，然后把它们的平均数写上去，这样一直操作直到只剩下一个数字，问剩下的这个数字有多少种不同的情况。  
答案对$10^9+7$取模  
$1 \leq n,m \leq 2000,2 \leq k \leq 2000$  
保证$n+m-1$能被$k$整除。

最后的答案一定能够写成若干 $\frac{1}{k}$ 的幂的形式，不妨看做 K 进制小数。同时可以知道的是， 0 对应的小数与 1 对应的小数加起来恰好是 1 。考虑 DP 这个小数，设 F[i][j] 表示前 i 位用了 j 个 0 的方案数，那么要求 $j \le n,i(K-1)-j \le m-1$ ，后者是 m-1  的原因是必须保证最后一位是 1 。一位可以下放成 K 个 1 到更低的位上，宏观上来看就是增加了 K-1  个  1 ，那么能够计入答案的就是满足 $j \equiv n \bmod{K-1},i(K-1)-j \equiv m-1 \bmod{K-1}$ 的。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

const int maxN=4010;
const int Mod=1e9+7;

int n,m,K,L;
int F[maxN][maxN];

void Plus(int &x,int y);
int main(){
    scanf("%d%d%d",&n,&m,&K);--m;L=(n+m)/(K-1);
    F[0][0]=1;int Ans=0;
    for (int i=1;i<=L;i++)
        for (int j=0;j<=min(i*(K-1),n);j++){
            for (int k=0;k<=K-1&&k<=j;k++)
                Plus(F[i][j],F[i-1][j-k]);
            if (j%(K-1)==n%(K-1)&&(K-1)*i-j<=m&&((K-1)*i-j)%(K-1)==m%(K-1)) Plus(Ans,F[i][j]-F[i-1][j]);
        }
    printf("%d\n",Ans);return 0;
}
void Plus(int &x,int y){
    x+=y;
    if (x>=Mod) x-=Mod;
    if (x<0) x+=Mod;
    return;
}
```