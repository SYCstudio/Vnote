# Yet Another String Matching Problem
[CF954I]

Suppose you have two strings $ s $ and $ t $ , and their length is equal. You may perform the following operation any number of times: choose two different characters $ c _ {1} $ and $ c _ {2} $ , and replace every occurence of $ c _ {1} $ in both strings with $ c _ {2} $ . Let's denote the distance between strings $ s $ and $ t $ as the minimum number of operations required to make these strings equal. For example, if $ s $ is abcd and $ t $ is ddcb, the distance between them is $ 2 $ — we may replace every occurence of a with b, so $ s $ becomes bbcd, and then we may replace every occurence of b with d, so both strings become ddcd.  
You are given two strings $ S $ and $ T $ . For every substring of $ S $ consisting of $ |T| $ characters you have to determine the distance between this substring and $ T $ .

定义一次操作是令两种字符等价。定义两个字符串的距离是操作其中一个使得两个字符串相同的最少操作次数。对于给出的 S,T 求所有 S 中长度为 |T| 的子串与 T 的距离。

首先可以明确的是操作的次数不会超过 5 ，另外就是如果存在不同的字符对 (a,b) 则一定需要至少一次操作把它们合并。枚举字符对， FFT 求解每一个合法子串中是否存在这样的字符对，最后并查集得到答案。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=401000;
const int Mod=998244353;
const int G=3;
const int inf=2147483647;

int L1,L2,N,L;
char S1[maxN],S2[maxN];
int A[maxN],B[maxN],Rader[maxN];
bool exi[6][6][maxN];
int UFS[7];

int QPow(int x,int cnt);
void NTT(int *P,int opt);
int Find(int x);

int main(){
	scanf("%s",S1);scanf("%s",S2);L1=strlen(S1);L2=strlen(S2);
	L=0;for (N=1;N<L1+L1;N<<=1) ++L;
	for (int i=0;i<N;i++) Rader[i]=(Rader[i>>1]>>1)|((i&1)<<(L-1));
	for (int i='a';i<='f';i++){
		for (int k=0;k<L1;k++) A[k]=(S1[k]==i);NTT(A,1);
		for (int j='a';j<='f';j++)
			if (i!=j){
				for (int k=0;k<L2;k++) B[k]=(S2[L2-k-1]==j);
				NTT(B,1);
				for (int k=0;k<N;k++) B[k]=1ll*A[k]*B[k]%Mod;
				NTT(B,-1);
				for (int k=L2-1;k<L1;k++) if (B[k]) exi[i-'a'][j-'a'][k]=1;
				for (int k=0;k<N;k++) B[k]=0;
			}
		for (int k=0;k<N;k++) A[k]=0;
	}
	for (int i=L2-1;i<L1;i++){
		int cnt=0;for (int j=1;j<=6;j++) UFS[j]=j;
		for (int a='a';a<='f';a++)
			for (int b='a';b<='f';b++)
				if ((exi[a-'a'][b-'a'][i])&&(Find(a-'a'+1)!=Find(b-'a'+1)))
					UFS[Find(a-'a'+1)]=Find(b-'a'+1),++cnt;
		printf("%d ",cnt);
	}
	return 0;
}

int QPow(int x,int cnt){
	int ret=1;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return ret;
}

void NTT(int *P,int opt){
	for (int i=0;i<N;i++) if (i<Rader[i]) swap(P[i],P[Rader[i]]);
	for (int i=1;i<N;i<<=1){
		int dw=QPow(G,(Mod-1)/(i<<1));
		if (opt==-1) dw=QPow(dw,Mod-2);
		for (int j=0;j<N;j+=(i<<1))
			for (int k=0,w=1;k<i;k++,w=1ll*w*dw%Mod){
				int X=P[j+k],Y=1ll*P[j+k+i]*w%Mod;
				P[j+k]=(X+Y)%Mod;P[j+k+i]=(X-Y)%Mod;
			}
	}
	if (opt==-1){
		int inv=QPow(N,Mod-2);
		for (int i=0;i<N;i++) P[i]=1ll*P[i]*inv%Mod;
	}
	return;
}

int Find(int x){
	if (UFS[x]!=x) return UFS[x]=Find(UFS[x]);
	return UFS[x];
}
```
