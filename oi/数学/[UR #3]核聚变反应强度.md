# [UR #3]核聚变反应强度
[UOJ48]

著名核物理专家 Picks 提出了核聚变特征值这一重要概念。  
核聚变特征值分别为 $x$ 和 $y$ 的两个原子进行核聚变，能产生数值为 $\text{sgcd}(x, y)$ 的核聚变反应强度。  
其中， $\text{sgcd}(x, y)$ 表示 $x$ 和 $y$ 的次大公约数，即能同时整除 $x, y$ 的正整数中第二大的数。如果次大公约数不存在则说明无法核聚变， 此时 $\text{sgcd}(x, y) = -1$。  
现在有 $n$ 个原子，核聚变特征值分别为 $a_1, a_2, \dots, a_n$。然后 Picks 又从兜里掏出一个核聚变特征值为 $a_1$ 的原子，你需要计算出这个原子与其它 $n$ 个原子分别进行核聚变反应时的核聚变反应强度，即 $\text{sgcd}(a_1, a_1), \text{sgcd}(a_1, a_2), \dots, \text{sgcd}(a_1, a_n)$。

注意到 $sgcd(x,y)=\gcd(x,y)/mn _ {xy}$ ，又有所有的质因子至少都是 $a _ 1$ 的质因子，所以预处理 $a _ 1$ 的质因子然后直接算。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<algorithm>
using namespace std;

#define ll long long

const int maxN=101000;

int n,pcnt;
ll A[maxN],P[maxN];

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%lld",&A[i]);
	ll x=A[1];
	for (int i=2;1ll*i*i<=x;i++)
		if (x%i==0){
			P[++pcnt]=i;while (x%i==0) x/=i;
		}
	if (x!=1) P[++pcnt]=x;
	for (int i=1;i<=n;i++){
		ll g=__gcd(A[1],A[i]);
		if (g==1){
			printf("-1 ");continue;
		}
		for (int j=1;j<=pcnt;j++)
			if (g%P[j]==0){
				printf("%lld ",g/P[j]);
				break;
			}
	}
	return 0;
}
```
