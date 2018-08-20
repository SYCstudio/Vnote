# Power Modulo Inverted
[SP MOD]

Given 3 positive integers x, y and z, you can find k = xy%z easily, by fast power-modulo algorithm. Now your task is the inverse of this algorithm. Given 3 positive integers x, z and k, find the smallest non-negative integer y, such that k%z = xy%z.

 求 $y ^ x \equiv z \mod p$，扩展 $BSGS$

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<map>
#include<cmath>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

map<int,int> M;

int gcd(int a,int b);
void BSGS(int x,int z,int k);

int main(){
	int x,z,k;
	while (scanf("%d%d%d",&x,&z,&k)!=EOF){
		if ((x==0)&&(z==0)&&(k==0)) break;
		BSGS(x,z,k);
	}
}

int gcd(int a,int b){
	if (b==0) return a;
	return gcd(b,a%b);
}

void BSGS(int x,int z,int k){
	if (z==1){
		printf("0\n");return;
	}
	int cnt=0,D=1;
	do{
		int d=gcd(x,z);if (d==1) break;
		if (k%d){
			printf("No Solution\n");return;
		}
		k/=d;z/=d;cnt++;D=1ll*D*(x/d)%z;
		if (D==k){
			printf("%d\n",cnt);return;
		}
	}
	while (1);

	M.clear();
	int m=ceil(sqrt(z));
	int now=k,T=1;M[k]=0;
	for (int i=1;i<=m;i++){
		now=1ll*now*x%z;T=1ll*T*x%z;
		M[now]=i;
	}
	now=D;
	for (int i=1;i<=m;i++){
		now=1ll*now*T%z;
		if (M.count(now)){
			printf("%d\n",i*m-M[now]+cnt);return;
		}
	}

	printf("No Solution\n");return;
}
```